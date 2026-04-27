from rest_framework import serializers
from django.contrib.auth.models import User
from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['address', 'age', 'birthday']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class UserCreateSerializer(DjoserUserCreateSerializer):
    name = serializers.CharField(required=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    birthday = serializers.DateField(required=False, allow_null=True)

    class Meta(DjoserUserCreateSerializer.Meta):
        fields = ('id', 'email', 'username', 'password', 're_password', 'name', 'first_name', 'last_name', 'address', 'age', 'birthday')

    def validate(self, data):
        # Call parent validation first
        data = super().validate(data)
        
        # Split name into first_name and last_name
        if data.get('name') and not data.get('first_name') and not data.get('last_name'):
            name_parts = data['name'].strip().split()
            data['first_name'] = name_parts[0]
            data['last_name'] = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
        
        return data

    def create(self, validated_data):
        # Extract profile data before calling parent create
        address = validated_data.pop('address', '')
        age = validated_data.pop('age', None)
        birthday = validated_data.pop('birthday', None)
        validated_data.pop('name', None)  # Remove name, already split
        
        # Call parent create
        user = super().create(validated_data)
        
        # Update profile if it exists
        if hasattr(user, 'profile'):
            user.profile.address = address
            user.profile.age = age
            user.profile.birthday = birthday
            user.profile.save()
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    address = serializers.CharField(required=False, allow_blank=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    birthday = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'address', 'age', 'birthday']

    def update(self, instance, validated_data):
        profile_data = {
            'address': validated_data.pop('address', instance.profile.address),
            'age': validated_data.pop('age', instance.profile.age),
            'birthday': validated_data.pop('birthday', instance.profile.birthday),
        }

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        profile = instance.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance

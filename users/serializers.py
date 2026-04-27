from rest_framework import serializers
from django.contrib.auth.models import User
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


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    address = serializers.CharField(required=False, allow_blank=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    birthday = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'address', 'age', 'birthday']

    def validate_email(self, value):
        """Check that email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use. Please use a different email or try logging in.")
        return value

    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        # Extract profile fields before creating user
        address = validated_data.pop('address', '')
        age = validated_data.pop('age', None)
        birthday = validated_data.pop('birthday', None)

        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Update the user's profile with the provided data
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

from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions as django_exceptions
from django.db import IntegrityError, transaction
from django.conf import settings as django_settings
from .models import UserProfile
from .email import CustomActivationEmail


class UserProfileSerializer(serializers.ModelSerializer):
    picture = serializers.ImageField(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['address', 'age', 'birthday', 'picture']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class UserCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=False,
        allow_blank=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message='A user with this username already exists.')]
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message='A user with this email already exists.')]
    )
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    re_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    birthday = serializers.DateField(required=False, allow_null=True)
    picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'password',
            're_password',
            'first_name',
            'last_name',
            'address',
            'age',
            'birthday',
            'picture',
        )

    def validate(self, data):
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password')
        re_password = data.get('re_password')

        if not username and email:
            username = email
            data['username'] = username

        if not username:
            raise serializers.ValidationError({'username': ['Username or email is required.']})

        if not password:
            raise serializers.ValidationError({'password': ['Password is required.']})

        if password != re_password:
            raise serializers.ValidationError({'re_password': ['Passwords do not match.']})

        user = User(
            username=username,
            email=email,
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
        )

        try:
            validate_password(password, user)
        except django_exceptions.ValidationError as exc:
            raise serializers.ValidationError({'password': list(exc.messages)})

        return data

    def create(self, validated_data):
        validated_data.pop('re_password', None)

        if not validated_data.get('username') and validated_data.get('email'):
            validated_data['username'] = validated_data['email']

        password = validated_data.pop('password')
        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=validated_data.get('username'),
                    email=validated_data.get('email'),
                    password=password,
                    first_name=validated_data.get('first_name', ''),
                    last_name=validated_data.get('last_name', ''),
                )

                if hasattr(user, 'profile'):
                    profile = user.profile
                else:
                    profile = UserProfile.objects.create(user=user)

                profile.address = validated_data.get('address', profile.address)
                profile.age = validated_data.get('age', profile.age)
                profile.birthday = validated_data.get('birthday', profile.birthday)
                if validated_data.get('picture') is not None:
                    profile.picture = validated_data.get('picture')
                profile.save()

                if django_settings.DJOSER.get('SEND_ACTIVATION_EMAIL', False):
                    user.is_active = False
                    user.save(update_fields=['is_active'])
                    request = self.context.get('request')
                    activation_email = CustomActivationEmail(request=request, context={'user': user})
                    activation_email.send([user.email])
        except IntegrityError as exc:
            raise serializers.ValidationError(
                {'non_field_errors': ['Unable to create account. A user with this username or email may already exist.']}
            )

        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    address = serializers.CharField(required=False, allow_blank=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    birthday = serializers.DateField(required=False, allow_null=True)
    picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'address', 'age', 'birthday', 'picture']

    def update(self, instance, validated_data):
        if not hasattr(instance, 'profile'):
            raise PermissionDenied('Authentication credentials were not provided.')

        profile = instance.profile
        profile_data = {
            'address': validated_data.pop('address', profile.address),
            'age': validated_data.pop('age', profile.age),
            'birthday': validated_data.pop('birthday', profile.birthday),
            'picture': validated_data.pop('picture', profile.picture),
        }

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance

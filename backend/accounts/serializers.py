from datetime import date
import re
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

def validar_nombre(value):
    if not re.match(r'^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$', value):
        raise serializers.ValidationError("Solo se permiten letras y espacios.")
    return value


def validar_telefono(value):
    if not value.isdigit():
        raise serializers.ValidationError("El teléfono solo puede contener números.")
    if len(value) < 8 or len(value) > 15:
        raise serializers.ValidationError("El teléfono debe tener entre 8 y 15 dígitos.")
    return value


def validar_fecha_nacimiento(value):
    hoy = date.today()
    if value > hoy:
        raise serializers.ValidationError("La fecha de nacimiento no puede ser en el futuro.")
    if value.year < 1900:
        raise serializers.ValidationError("La fecha de nacimiento no puede ser menor a 1900.")
    return value

class RegisterMedicoSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'fecha_nacimiento', 'sexo',
            'telefono', 'especialidad', 'is_medico'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        if not data.get('especialidad'):
            raise serializers.ValidationError({"especialidad": "La especialidad es obligatoria para médicos."})
        return data
    
    def validate_first_name(self, value):
        return validar_nombre(value)

    def validate_last_name(self, value):
        return validar_nombre(value)

    def validate_telefono(self, value):
        return validar_telefono(value)

    def validate_fecha_nacimiento(self, value):
        return validar_fecha_nacimiento(value)

    def create(self, validated_data):
        validated_data.pop('password2')
        validated_data['is_medico'] = True
        validated_data['is_paciente'] = False

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            fecha_nacimiento=validated_data.get('fecha_nacimiento'),
            sexo=validated_data.get('sexo'),
            telefono=validated_data.get('telefono'),
            especialidad=validated_data.get('especialidad'),
            is_medico=True,
            is_paciente=False,
        )
        return user

class RegisterPacienteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'fecha_nacimiento', 'sexo',
            'telefono', 'is_paciente'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return data

    def validate_first_name(self, value):
        return validar_nombre(value)

    def validate_last_name(self, value):
        return validar_nombre(value)

    def validate_telefono(self, value):
        return validar_telefono(value)

    def validate_fecha_nacimiento(self, value):
        return validar_fecha_nacimiento(value)
    
    def create(self, validated_data):
        validated_data.pop('password2')
        validated_data['is_medico'] = False
        validated_data['is_paciente'] = True

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            fecha_nacimiento=validated_data.get('fecha_nacimiento'),
            sexo=validated_data.get('sexo'),
            telefono=validated_data.get('telefono'),
            is_medico=False,
            is_paciente=True,
        )
        return user
    def validate_fecha_nacimiento(self, value):
        hoy = date.today()
        if value > hoy:
            raise serializers.ValidationError("La fecha de nacimiento no puede ser en el futuro.")
        if value.year < 1900:
            raise serializers.ValidationError("La fecha de nacimiento no puede ser menor a 1900.")
        return value

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'fecha_nacimiento', 'sexo', 'telefono', 'especialidad',
            'is_medico', 'is_paciente'
        ]
        read_only_fields = ['id', 'username', 'email']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(username=username_or_email, password=password)

        if not user:
            try:
                user_obj = User.objects.get(email=username_or_email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError('Credenciales inválidas.')

        attrs['user'] = user
        return super().validate({"username": user.username, "password": password})

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        token['full_name'] = user.get_full_name()
        token['is_medico'] = user.is_medico
        token['is_paciente'] = user.is_paciente
        token['fecha_nacimiento'] = str(user.fecha_nacimiento) if user.fecha_nacimiento else None
        token['sexo'] = user.sexo
        token['telefono'] = user.telefono
        token['especialidad'] = user.especialidad if user.is_medico else None

        return token
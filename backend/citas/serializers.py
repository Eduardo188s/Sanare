from rest_framework import serializers
from .models import Cita, Especialidad, Medico, Clinica, Horario

class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = ['id', 'nombre']

class MedicoSerializer(serializers.ModelSerializer):
    especialidad = EspecialidadSerializer(read_only=True)

    class Meta:
        model = Medico
        fields = ['id', 'nombre', 'especialidad']

class ClinicaSerializer(serializers.ModelSerializer):
    medico_responsable = MedicoSerializer(read_only=True)

    class Meta:
        model = Clinica
        fields = ['id', 'nombre', 'descripcion', 'imagen', 'ubicacion', 'hora_apertura', 'hora_cierre', 'medico_responsable']

class HorarioSerializer(serializers.ModelSerializer):
    medico = serializers.PrimaryKeyRelatedField(queryset=Medico.objects.all())

    class Meta:
        model = Horario
        fields = '__all__'

class CitaSerializer(serializers.ModelSerializer):
    clinica_nombre = serializers.CharField(source='clinica.nombre', read_only=True)
    ubicacion = serializers.CharField(source='clinica.ubicacion', read_only=True)
    medico_nombre = serializers.CharField(source='medico.nombre', read_only=True)
    paciente_username = serializers.CharField(source='paciente.username', read_only=True)

    class Meta:
        model = Cita
        fields = '__all__'

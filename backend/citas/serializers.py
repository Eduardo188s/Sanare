from rest_framework import serializers
from .models import Cita, Especialidad, Medico, Clinica, Horario

class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = ['id', 'nombre']

class MedicoSerializer(serializers.ModelSerializer):
    especialidad = serializers.PrimaryKeyRelatedField(queryset=Especialidad.objects.all())
    clinica = serializers.PrimaryKeyRelatedField(queryset=Clinica.objects.all())
    class Meta:
        model = Medico
        fields = '__all__'

class ClinicaSerializer(serializers.ModelSerializer):
    medicos = MedicoSerializer(many=True, read_only=True)
    especialidades = serializers.SerializerMethodField()
    class Meta:
        model = Clinica
        fields = '__all__'
    def get_especialidades(self, obj):
        especialidades = obj.medicos.values_list('especialidad__nombre', flat=True).distinct()
        return list(especialidades)

class HorarioSerializer(serializers.ModelSerializer):
    medico = serializers.PrimaryKeyRelatedField(queryset=Medico.objects.all())
    class Meta:
        model = Horario
        fields = '__all__'

class CitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        fields = '__all__'
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

    def get_horarios(self, obj):
        if obj.hora_apertura and obj.hora_cierre:
            return [f"{obj.hora_apertura.strftime('%H:%M')} - {obj.hora_cierre.strftime('%H:%M')}"]
        return ["No especificado"]
        
    def get_especialidades(self, obj):
        especialidades = obj.medicos.values_list('especialidad__nombre', flat=True).distinct()
        return list(especialidades)

class HorarioSerializer(serializers.ModelSerializer):
    medico = serializers.PrimaryKeyRelatedField(queryset=Medico.objects.all())

    class Meta:
        model = Horario
        fields = '__all__'

class CitaSerializer(serializers.ModelSerializer):
    clinica_nombre = serializers.CharField(source='clinica.nombre', read_only=True)
    ubicacion = serializers.CharField(source='clinica.ubicacion', read_only=True)
    medico_nombre = serializers.CharField(source='medico.nombre', read_only=True)

    class Meta:
        model = Cita
        fields = '__all__'
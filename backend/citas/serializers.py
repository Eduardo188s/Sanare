import json
from rest_framework import serializers
from .models import Cita, Especialidad, Clinica, Horario, User, Notificacion

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    especialidad_nombre = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'is_medico', 'is_paciente', 'especialidad_nombre']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
    
    def get_especialidad_nombre(self, obj):
        if obj.is_medico and obj.especialidad:
            return obj.especialidad
        return None
    
class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = ['id', 'nombre']

class ClinicaSerializer(serializers.ModelSerializer):
    medico_responsable = UserSerializer(read_only=True)
    dias_habiles = serializers.ListField(
        child=serializers.IntegerField(min_value=0, max_value=6),
        required=False
    )

    class Meta:
        model = Clinica
        fields = [
            'id', 'nombre', 'descripcion', 'imagen',
            'ubicacion', 'hora_apertura', 'hora_cierre',
            'dias_habiles', 'medico_responsable'
        ]

    def create(self, validated_data):
        dias_habiles = validated_data.pop('dias_habiles', [])
        clinica = Clinica.objects.create(**validated_data)
        clinica.dias_habiles = dias_habiles
        clinica.save()
        return clinica

    def update(self, instance, validated_data):
        dias_habiles = validated_data.pop('dias_habiles', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if dias_habiles is not None:
            instance.dias_habiles = [int(d) for d in dias_habiles]
        instance.save()
        return instance

    def validate(self, data):
        user = self.context['request'].user
        instance = getattr(self, 'instance', None)

        if user.is_medico and Clinica.objects.filter(medico_responsable=user).exclude(id=getattr(instance, 'id', None)).exists():
            raise serializers.ValidationError("Ya tienes una clínica registrada.")

        hora_apertura = data.get('hora_apertura', getattr(instance, 'hora_apertura', None))
        hora_cierre = data.get('hora_cierre', getattr(instance, 'hora_cierre', None))

        if hora_apertura and hora_cierre and hora_apertura >= hora_cierre:
            raise serializers.ValidationError("La hora de apertura debe ser menor que la de cierre.")
        return data


class CitaSerializer(serializers.ModelSerializer):
    paciente = UserSerializer(read_only=True)
    medico = UserSerializer(read_only=True)
    clinica = ClinicaSerializer(read_only=True)

    paciente_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_paciente=True), source='paciente', write_only=True
    )
    medico_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_medico=True), source='medico', write_only=True
    )
    clinica_id = serializers.PrimaryKeyRelatedField(
        queryset=Clinica.objects.all(), source='clinica', write_only=True
    )

    estado = serializers.CharField(read_only=True)
    clinica_nombre = serializers.CharField(source='clinica.nombre', read_only=True)
    medico_nombre = serializers.CharField(source='medico.get_full_name', read_only=True)
    paciente_nombre = serializers.CharField(source='paciente.get_full_name', read_only=True)
    ubicacion = serializers.CharField(source='clinica.ubicacion', read_only=True)
    motivo = serializers.CharField(allow_blank=True, allow_null=True, read_only=True)

    class Meta:
        model = Cita
        fields = [
            'id', 'fecha', 'hora',
            'paciente', 'medico', 'clinica',
            'paciente_id', 'medico_id', 'clinica_id',
            'estado', 'clinica_nombre', 'medico_nombre', 'paciente_nombre',
            'ubicacion', 'motivo'
        ]

class NotificacionSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(source="cita.paciente.get_full_name", read_only=True)
    clinica_nombre = serializers.CharField(source="cita.clinica.nombre", read_only=True)
    clinica = ClinicaSerializer(source="cita.clinica", read_only=True)
    fecha_cita = serializers.DateField(source="cita.fecha", read_only=True)
    hora_cita = serializers.TimeField(source="cita.hora", read_only=True)

    class Meta:
        model = Notificacion
        fields = [
            "id", "mensaje", "leida", "fecha_creacion",
            "paciente_nombre", "fecha_cita", "hora_cita", "clinica_nombre", "clinica"
        ]

class HorarioSerializer(serializers.ModelSerializer):
    medico = UserSerializer(read_only=True)
    dia_semana_display = serializers.CharField(source='get_dia_semana_display', read_only=True)

    class Meta:
        model = Horario
        fields = ['id', 'medico', 'dia_semana', 'dia_semana_display', 'hora_inicio', 'hora_fin']
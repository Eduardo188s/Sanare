from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.dispatch import receiver
from django.db.models.signals import post_save

User = get_user_model()

DIA_SEMANA_CHOICES = [
    (0, 'Lunes'),
    (1, 'Martes'),
    (2, 'Miércoles'),
    (3, 'Jueves'),
    (4, 'Viernes'),
    (5, 'Sábado'),
    (6, 'Domingo'),
]

class Especialidad(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Especialidades"

    def __str__(self):
        return self.nombre

class Clinica(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    ubicacion = models.CharField(max_length=200)
    hora_apertura = models.TimeField(null=True, blank=True)
    hora_cierre = models.TimeField(null=True, blank=True)
    dias_habiles = models.JSONField(default=list, blank=True)
    imagen = models.ImageField(upload_to='clinicas/', null=True, blank=True)
    medico_responsable = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="clinicas_responsable",
        limit_choices_to={'is_medico': True}
    )

    def clean(self):
        super().clean()
        if self.hora_apertura and self.hora_cierre:
            if self.hora_apertura >= self.hora_cierre:
                raise ValidationError('La hora de apertura debe ser menor que la hora de cierre.')

    def __str__(self):
        return self.nombre

class Horario(models.Model):
    medico = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='horarios_disponibles',
        limit_choices_to={'is_medico': True}
    )
    dia_semana = models.IntegerField(choices=DIA_SEMANA_CHOICES)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    class Meta:
        unique_together = ('medico', 'dia_semana')

    def __str__(self):
        return f"{self.medico.get_full_name()} - {self.get_dia_semana_display()} {self.hora_inicio}-{self.hora_fin}"

class Cita(models.Model):
    paciente = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='citas_paciente',
        limit_choices_to={'is_paciente': True}
    )
    medico = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='citas_medico',
        limit_choices_to={'is_medico': True}
    )
    clinica = models.ForeignKey(Clinica, on_delete=models.CASCADE, related_name='citas')
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField()
    completada = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['fecha', 'hora']

    def __str__(self):
        return f"Cita de {self.paciente.username} con {self.medico.username} el {self.fecha} a las {self.hora}"
    
class Notificacion(models.Model):
    medico = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notificaciones_medico",
        limit_choices_to={'is_medico': True}
    )
    cita = models.ForeignKey("Cita", on_delete=models.CASCADE, related_name="notificaciones")
    mensaje = models.CharField(max_length=255)
    leida = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-fecha_creacion"]

    def __str__(self):
        return f"Notificación para {self.medico.username} - {self.mensaje}"
    
@receiver(post_save, sender=Clinica)
def crear_horarios_para_medico(sender, instance, created, **kwargs):
    if created and instance.medico_responsable:
        for dia in instance.dias_habiles:
            Horario.objects.get_or_create(
                medico=instance.medico_responsable,
                dia_semana=dia,
                defaults={
                    'hora_inicio': instance.hora_apertura,
                    'hora_fin': instance.hora_cierre,
                }
            )
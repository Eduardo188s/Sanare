from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.dispatch import receiver
from django.db.models.signals import post_save

User = get_user_model()

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
        related_name='horarios',
        limit_choices_to={'is_medico': True}
    )
    dia = models.DateField()
    hora = models.TimeField()
    disponible = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.medico.get_full_name()} - {self.dia} {self.hora} ({'Disponible' if self.disponible else 'No disponible'})"

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
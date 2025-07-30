from django.db import models
from django.contrib.auth.models import User
from django.forms import ValidationError

class Especialidad(models.Model):
    nombre = models.CharField(max_length=100)

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
        "Medico",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="clinicas"
    )

    def clean(self):
        if self.hora_apertura and self.hora_cierre:
            if self.hora_apertura >= self.hora_cierre:
                raise ValidationError('La hora de apertura debe ser menor que la hora de cierre.')

    def __str__(self):
        return self.nombre

class Medico(models.Model):
    nombre = models.CharField(max_length=200)
    especialidad = models.ForeignKey(Especialidad, on_delete=models.CASCADE, related_name='medicos')
    clinica = models.ForeignKey(Clinica, on_delete=models.CASCADE, related_name='medicos')

    def __str__(self):
        return f"{self.nombre} - {self.especialidad}"

class Horario(models.Model):
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    dia = models.DateField()
    hora = models.TimeField()
    disponible = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.medico.nombre} - {self.dia} {self.hora} ({'Disponible' if self.disponible else 'No disponible'})"

class Cita(models.Model):
    paciente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='citas_paciente')
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='citas', null=True, blank=True)
    clinica = models.ForeignKey(Clinica, on_delete=models.CASCADE, related_name='citas', default=1)
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField()
    estado = models.CharField(max_length=20, choices=[
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('completada', 'Completada'),
    ], default='pendiente')

    def __str__(self):
        return f"Cita de {self.paciente.username} con {self.medico.nombre if self.medico else 'Sin médico'} el {self.fecha} a las {self.hora}"
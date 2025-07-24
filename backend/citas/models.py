from django.db import models
from django.contrib.auth.models import User

class Especialidad(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Clinica(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    ubicacion = models.CharField(max_length=200)
    horario = models.CharField(max_length=100, null=True, blank=True)
    imagen = models.ImageField(upload_to='clinicas/', null=True, blank=True)

    def __str__(self):
        return self.nombre


class Medico(models.Model):
    nombre = models.CharField(max_length=200)
    especialidad = models.ForeignKey(Especialidad, on_delete=models.CASCADE, related_name='medicos')
    clinica = models.ForeignKey(Clinica, on_delete=models.CASCADE, related_name='medicos')

    def __str__(self):
        return f"{self.nombre} - {self.especialidad}"


class Horario(models.Model):
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='horarios')
    dia = models.DateField()
    hora = models.TimeField()
    disponible = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.medico} - {self.dia} {self.hora}"

class Cita(models.Model):
    paciente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='citas_paciente')
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='citas')
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField()
    estado = models.CharField(max_length=20, choices=[
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('completada', 'Completada'),
    ], default='pendiente')
    ubicacion = models.CharField(max_length=255, null=True, blank=True)
    clinica = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Cita de {self.paciente.username} con {self.medico.username} el {self.fecha} a las {self.hora}"
from django.db import models
from django.contrib.auth.models import User

class Cita(models.Model):
    paciente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='citas_paciente')
    medico = models.ForeignKey(User, on_delete=models.CASCADE, related_name='citas_medico')
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
        return f"Cita de {self.paciente.username} con {self.medico.username} el {self.fecha} a las {self.hora}"
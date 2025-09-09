from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_medico = models.BooleanField(default=False)
    is_paciente = models.BooleanField(default=False)

    fecha_nacimiento = models.DateField(null=True, blank=True)
    sexo = models.CharField(
        max_length=10,
        choices=[("M", "Masculino"), ("F", "Femenino")],
        null=True,
        blank=True
    )
    telefono = models.CharField(max_length=15, null=True, blank=True)
    especialidad = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.username
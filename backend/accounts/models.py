from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_medico = models.BooleanField(default=False)
    is_paciente = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.username

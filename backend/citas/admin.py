from django.contrib import admin
from .models import Cita, Clinica, Especialidad, Notificacion

admin.site.register(Clinica)
admin.site.register(Especialidad)
admin.site.register(Cita)
admin.site.register(Notificacion)
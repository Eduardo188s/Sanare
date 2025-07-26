from django.contrib import admin
from .models import Cita, Clinica, Medico, Especialidad

admin.site.register(Clinica)
admin.site.register(Medico)
admin.site.register(Especialidad)
admin.site.register(Cita)
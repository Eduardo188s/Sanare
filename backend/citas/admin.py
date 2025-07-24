from django.contrib import admin
from .models import Cita, Clinica, Medico, Especialidad, Horario

admin.site.register(Clinica)
admin.site.register(Medico)
admin.site.register(Especialidad)
admin.site.register(Horario)
admin.site.register(Cita)
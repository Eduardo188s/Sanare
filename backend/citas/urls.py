from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CitaViewSet, ClinicaViewSet, MedicoViewSet, EspecialidadViewSet, HorarioViewSet
from .views import cancelar_cita, obtener_horarios_disponibles, agendar_cita, obtener_citas 

router = DefaultRouter()
router.register(r'citas', CitaViewSet)
router.register(r'clinicas', ClinicaViewSet)
router.register(r'medicos', MedicoViewSet)
router.register(r'especialidades', EspecialidadViewSet)
router.register(r'horarios', HorarioViewSet) 

urlpatterns = [
    path('', include(router.urls)), 
    path('citas/<int:cita_id>/cancelar/', cancelar_cita, name='cancelar_cita'),
    path('citas/my/', obtener_citas, name='obtener_mis_citas'),

    path('horarios-disponibles/<int:medico_id>/', obtener_horarios_disponibles, name='horarios_disponibles'),
    path('medicos/<int:medico_id>/agendar-cita/', agendar_cita, name='agendar_cita'),
]


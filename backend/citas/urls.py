from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CitaViewSet, ClinicaViewSet, EspecialidadViewSet, HorarioViewSet, NotificacionViewSet
from .views import cancelar_cita, obtener_horarios_disponibles, agendar_cita, obtener_citas, marcar_notificacion_leida

router = DefaultRouter()
router.register(r'citas', CitaViewSet, basename='citas')
router.register(r'clinicas', ClinicaViewSet, basename='clinicas')
router.register(r'especialidades', EspecialidadViewSet)
router.register(r'horarios', HorarioViewSet)
router.register(r'notificaciones', NotificacionViewSet, basename="notificacion")

urlpatterns = [
    path('', include(router.urls)), 
    path('citas/<int:cita_id>/cancelar/', cancelar_cita, name='cancelar_cita'),
    path('citas/my/', obtener_citas, name='obtener_mis_citas'),
    path('clinicas/<int:clinica_id>/horarios_disponibles/', obtener_horarios_disponibles, name='horarios_disponibles_por_clinica'),
    path('medicos/<int:medico_id>/agendar-cita/', agendar_cita, name='agendar_cita'),
    path('notificaciones/<int:pk>/leer/', marcar_notificacion_leida, name='notificacion-leer'),
]


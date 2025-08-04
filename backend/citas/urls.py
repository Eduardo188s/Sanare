from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CitaViewSet, ClinicaViewSet, MedicoViewSet, EspecialidadViewSet, HorarioViewSet
from .views import cancelar_cita, obtener_horarios_disponibles, agendar_cita, obtener_citas # Asegúrate de importar obtener_citas si la sigues usando

router = DefaultRouter()
router.register(r'citas', CitaViewSet)
router.register(r'clinicas', ClinicaViewSet)
router.register(r'medicos', MedicoViewSet)
router.register(r'especialidades', EspecialidadViewSet)
router.register(r'horarios', HorarioViewSet) # Asegúrate de que HorarioViewSet esté aquí

urlpatterns = [
    path('', include(router.urls)), # Incluye todas las rutas generadas por el router
    path('citas/<int:cita_id>/cancelar/', cancelar_cita, name='cancelar_cita'),
    # Si quieres una función aparte para obtener citas, mantenla.
    # Si CitaViewSet.list() es suficiente para /api/citas/, puedes comentar/eliminar la línea de abajo.
    path('citas/my/', obtener_citas, name='obtener_mis_citas'), # Le cambié el nombre para evitar conflictos con el router

    path('horarios-disponibles/<int:medico_id>/', obtener_horarios_disponibles, name='horarios_disponibles'),
    path('medicos/<int:medico_id>/agendar-cita/', agendar_cita, name='agendar_cita'),
]

# No es necesario duplicar staticfiles aquí
# from django.conf.urls.static import static
# from django.conf import settings
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
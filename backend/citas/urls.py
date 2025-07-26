from django.conf.urls.static import static
from django.conf import settings
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CitaViewSet, ClinicaViewSet, MedicoViewSet, EspecialidadViewSet
from .views import cancelar_cita, obtener_citas, obtener_horarios_disponibles

router = DefaultRouter()
router.register(r'citas', CitaViewSet)
router.register(r'clinicas', ClinicaViewSet)
router.register(r'medicos', MedicoViewSet)
router.register(r'especialidades', EspecialidadViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('citas/<int:cita_id>/cancelar/', cancelar_cita, name='cancelar_cita'),
    path('citas/', obtener_citas, name='obtener_citas'),
    path('horarios-disponibles/<int:medico_id>/', obtener_horarios_disponibles, name='horarios_disponibles'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CitaViewSet, ClinicaViewSet, MedicoViewSet, EspecialidadViewSet, HorarioViewSet
from .views import cancelar_cita, obtener_citas

router = DefaultRouter()
router.register(r'citas', CitaViewSet)
router.register(r'clinicas', ClinicaViewSet)
router.register(r'medicos', MedicoViewSet)
router.register(r'especialidades', EspecialidadViewSet)
router.register(r'horarios', HorarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('citas/<int:cita_id>/cancelar/', cancelar_cita, name='cancelar_cita'),
    path('citas/', obtener_citas, name='obtener_citas'),
]

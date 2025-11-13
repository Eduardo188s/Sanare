
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Cita, Notificacion

@receiver(post_save, sender=Cita)
def crear_notificacion_cita(sender, instance, created, **kwargs):
    if created and instance.medico:
        Notificacion.objects.create(
    medico=instance.medico,
    cita=instance,
    mensaje=f"Tienes una nueva cita con {instance.paciente.get_full_name()}"
)

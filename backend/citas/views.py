from rest_framework import viewsets
from .models import Cita
from .serializers import CitaSerializer
from rest_framework.permissions import IsAuthenticated

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    # permission_classes = [IsAuthenticated]
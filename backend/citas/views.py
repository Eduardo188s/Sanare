from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from .models import Cita, Clinica, Medico, Especialidad, Horario
from .serializers import CitaSerializer, ClinicaSerializer, MedicoSerializer, EspecialidadSerializer, HorarioSerializer
#from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
        
def agendar_cita(request, medico_id):
    medico = get_object_or_404(Medico, pk=medico_id)
    horarios = Horario.objects.filter(medico=medico, disponible=True).order_by('dia', 'hora')
    return render(request, 'agendar_cita.html', {
        'medico': medico,
        'horarios': horarios
    })

@api_view(['PATCH'])
def cancelar_cita(request, cita_id):
    try:
        cita = Cita.objects.get(id=cita_id)
        cita.estado = 'cancelada'
        cita.save()
        return Response({'mensaje': 'Cita cancelada correctamente'}, status=status.HTTP_200_OK)
    except Cita.DoesNotExist:
        return Response({'error': 'Cita no encontrada'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def obtener_citas(request):
    usuario = request.user
    citas = Cita.objects.filter(paciente=usuario) | Cita.objects.filter(medico=usuario)
    citas = citas.order_by('-fecha', '-hora')
    serializer = CitaSerializer(citas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class ClinicaViewSet(viewsets.ModelViewSet):
    queryset = Clinica.objects.all()
    serializer_class = ClinicaSerializer

class MedicoViewSet(viewsets.ModelViewSet):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer

class EspecialidadViewSet(viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    #permission_classes = [IsAuthenticated]

    

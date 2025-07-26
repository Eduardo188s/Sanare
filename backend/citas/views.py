from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from .models import Cita, Clinica, Medico, Especialidad, Horario
from .serializers import CitaSerializer, ClinicaSerializer, MedicoSerializer, EspecialidadSerializer, HorarioSerializer
#from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
        
@api_view(['GET'])
def obtener_horarios_disponibles(request, medico_id):
    horarios = Horario.objects.filter(medico_id=medico_id)
    horarios_disponibles = []

    for horario in horarios:
        existe_cita = Cita.objects.filter(
            fecha=horario.fecha,
            hora=horario.hora,
            medico_id=medico_id
        ).exists()

        if not existe_cita:
            horarios_disponibles.append(horario)

    serializer = HorarioSerializer(horarios_disponibles, many=True)
    return Response(serializer.data)

def agendar_cita(request, medico_id):
    horario = Horario.objects.get(id=request.POST['horario_id'])
    if not horario.disponible:
        return JsonResponse({'error': 'El horario ya no está disponible'}, status=400)

    cita = Cita.objects.create(
        paciente=request.user.paciente,
        medico=horario.medico,
        fecha=horario.dia,
        hora=horario.hora
    )

    horario.disponible = False
    horario.save()

    return JsonResponse({'mensaje': 'Cita agendada con éxito'})

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

    

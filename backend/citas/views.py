from datetime import datetime, timedelta
from django.http import JsonResponse
from django.utils.dateparse import parse_date
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Cita, Clinica, Medico, Especialidad, Horario
from .serializers import (
    CitaSerializer,
    ClinicaSerializer,
    MedicoSerializer,
    EspecialidadSerializer,
    HorarioSerializer,
)


@api_view(['GET'])
def obtener_horarios_disponibles(request, medico_id):
    
    fecha_str = request.query_params.get('fecha')
    if not fecha_str:
        return Response({"error": "Se requiere el parámetro fecha (YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)

    fecha = parse_date(fecha_str)
    if not fecha:
        return Response({"error": "Formato de fecha inválido"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        medico = Medico.objects.get(id=medico_id)
    except Medico.DoesNotExist:
        return Response({"error": "Médico no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    clinica = medico.clinica
    if not clinica.hora_apertura or not clinica.hora_cierre:
        return Response({"error": "La clínica no tiene horas de apertura y cierre configuradas"}, status=status.HTTP_400_BAD_REQUEST)

    hora_actual = datetime.combine(fecha, clinica.hora_apertura)
    hora_cierre_dt = datetime.combine(fecha, clinica.hora_cierre)
    posibles_horas = []
    while hora_actual < hora_cierre_dt:
        posibles_horas.append(hora_actual.time())
        hora_actual += timedelta(hours=1)

    citas = Cita.objects.filter(
        medico_id=medico_id,
        fecha=fecha
    ).values_list("hora", flat=True)

    horas_disponibles = [h.strftime("%H:%M") for h in posibles_horas if h not in citas]

    return Response([{"hora": h} for h in horas_disponibles])


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
    parser_classes = (MultiPartParser, FormParser)


class MedicoViewSet(viewsets.ModelViewSet):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        clinica_id = self.request.query_params.get('clinica')
        especialidad_id = self.request.query_params.get('especialidad')

        if clinica_id:
            queryset = queryset.filter(clinica_id=clinica_id)

        if especialidad_id:
            queryset = queryset.filter(especialidad_id=especialidad_id)

        return queryset


class EspecialidadViewSet(viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        clinica_id = self.request.query_params.get('clinica')

        if clinica_id:
            queryset = queryset.filter(
                medicos__clinica_id=clinica_id
            ).distinct()

        return queryset


class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    # permission_classes = [IsAuthenticated]

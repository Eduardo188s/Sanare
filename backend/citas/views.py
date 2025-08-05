from datetime import datetime, timedelta
from django.http import JsonResponse
from django.utils.dateparse import parse_date
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly

from .models import Cita, Clinica, Medico, Especialidad, Horario
from .serializers import (
    CitaSerializer,
    ClinicaSerializer,
    MedicoSerializer,
    EspecialidadSerializer,
    HorarioSerializer,
)
# Importar el modelo de usuario personalizado
from django.contrib.auth import get_user_model
User = get_user_model() # Obtener el modelo de usuario personalizado

@api_view(['GET'])
@permission_classes([AllowAny]) # Cualquiera puede ver horarios disponibles para un médico
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
    # Citas cada 30 minutos, ajusta si es cada hora (timedelta(hours=1))
    while hora_actual < hora_cierre_dt:
        posibles_horas.append(hora_actual.time())
        hora_actual += timedelta(minutes=30)

    citas_ocupadas = Cita.objects.filter(
        medico_id=medico_id,
        fecha=fecha,
        estado__in=['pendiente', 'confirmada'] # Considerar ambos estados como ocupados
    ).values_list("hora", flat=True)

    horas_disponibles = [h.strftime("%H:%M") for h in posibles_horas if h not in citas_ocupadas]

    return Response([{"hora": h} for h in horas_disponibles])


@api_view(['POST'])
@permission_classes([IsAuthenticated]) # Solo usuarios autenticados pueden agendar citas
def agendar_cita(request, medico_id):
    if not request.user.is_paciente:
        return Response({'error': 'Solo los pacientes pueden agendar citas.'}, status=status.HTTP_403_FORBIDDEN)

    fecha_str = request.data.get('fecha')
    hora_str = request.data.get('hora')
    motivo = request.data.get('motivo')
    clinica_id = request.data.get('clinica_id') # Asegúrate que el frontend envíe esto

    if not all([fecha_str, hora_str, motivo, clinica_id]):
        return Response({"error": "Faltan datos para agendar la cita."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        fecha_dt = datetime.strptime(fecha_str, '%Y-%m-%d').date()
        hora_dt = datetime.strptime(hora_str, '%H:%M').time()
        medico = Medico.objects.get(id=medico_id)
        clinica = Clinica.objects.get(id=clinica_id)
    except (ValueError, Medico.DoesNotExist, Clinica.DoesNotExist):
        return Response({"error": "Datos inválidos o médico/clínica no encontrado."}, status=status.HTTP_400_BAD_REQUEST)

    if Cita.objects.filter(
        medico=medico,
        fecha=fecha_dt,
        hora=hora_dt,
        estado__in=['pendiente', 'confirmada']
    ).exists():
        return Response({"error": "Esta hora ya está ocupada para este médico."}, status=status.HTTP_400_BAD_REQUEST)

    cita = Cita.objects.create(
        paciente=request.user, # El usuario autenticado es el paciente
        medico=medico,
        clinica=clinica,
        fecha=fecha_dt,
        hora=hora_dt,
        motivo=motivo
    )

    serializer = CitaSerializer(cita)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def cancelar_cita(request, cita_id):
    try:
        cita = Cita.objects.get(id=cita_id)
        # Solo el paciente que creó la cita o el médico asociado pueden cancelarla
        # Asegúrate de que Medico.user existe y es igual a request.user
        if request.user == cita.paciente or \
           (request.user.is_medico and hasattr(request.user, 'medico_profile') and request.user.medico_profile == cita.medico):
            cita.estado = 'cancelada'
            cita.save()
            return Response({'mensaje': 'Cita cancelada correctamente'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No tiene permiso para cancelar esta cita.'}, status=status.HTTP_403_FORBIDDEN)
    except Cita.DoesNotExist:
        return Response({'error': 'Cita no encontrada'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_citas(request):
    usuario = request.user
    citas_query = Cita.objects.none()

    if usuario.is_paciente:
        citas_query = Cita.objects.filter(paciente=usuario)
    elif usuario.is_medico and hasattr(usuario, 'medico_profile'):
        citas_query = Cita.objects.filter(medico=usuario.medico_profile)
    else:
        return Response({'error': 'Usuario no tiene un rol válido (paciente o médico).'}, status=status.HTTP_403_FORBIDDEN)

    citas = citas_query.order_by('-fecha', '-hora')
    serializer = CitaSerializer(citas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


class ClinicaViewSet(viewsets.ModelViewSet):
    queryset = Clinica.objects.all()
    serializer_class = ClinicaSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [AllowAny] # Permite a cualquiera ver las clínicas, pero solo staff/admin editar

class MedicoViewSet(viewsets.ModelViewSet):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
    permission_classes = [AllowAny] # Permite a cualquiera ver los médicos

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
    permission_classes = [AllowAny] # Permite a cualquiera ver especialidades

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
    permission_classes = [IsAuthenticated] # Solo usuarios autenticados pueden ver/gestionar horarios

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_medico and hasattr(user, 'medico_profile'):
            return Horario.objects.filter(medico=user.medico_profile)
        # Si no es un médico autenticado, puedes devolver una lista vacía
        return Horario.objects.none() # Un médico solo debería ver/gestionar sus propios horarios

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_medico and hasattr(user, 'medico_profile'):
            serializer.save(medico=user.medico_profile)
        else:
            raise status.HTTP_403_FORBIDDEN("Solo los médicos pueden crear horarios.")

    def perform_update(self, serializer):
        user = self.request.user
        if user.is_medico and hasattr(user, 'medico_profile') and serializer.instance.medico == user.medico_profile:
            serializer.save()
        else:
            raise status.HTTP_403_FORBIDDEN("No tiene permiso para actualizar este horario.")

    def perform_destroy(self, instance):
        user = self.request.user
        if user.is_medico and hasattr(user, 'medico_profile') and instance.medico == user.medico_profile:
            instance.delete()
        else:
            raise status.HTTP_403_FORBIDDEN("No tiene permiso para eliminar este horario.")


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated] # Las citas deben ser manejadas por usuarios autenticados

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_paciente:
                return Cita.objects.filter(paciente=user)
            elif user.is_medico and hasattr(user, 'medico_profile'):
                return Cita.objects.filter(medico=user.medico_profile)
        return Cita.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_paciente:
            serializer.save(paciente=user)
        else:
            raise status.HTTP_403_FORBIDDEN("Solo los pacientes pueden crear citas directamente.")

    def perform_update(self, serializer):
        user = self.request.user
        instance = self.get_object()
        if user == instance.paciente or (user.is_medico and hasattr(user, 'medico_profile') and user.medico_profile == instance.medico):
            serializer.save()
        else:
            raise status.HTTP_403_FORBIDDEN("No tiene permiso para actualizar esta cita.")

    def perform_destroy(self, instance):
        user = self.request.user
        if user == instance.paciente or (user.is_medico and hasattr(user, 'medico_profile') and user.medico_profile == instance.medico):
            instance.delete()
        else:
            raise status.HTTP_403_FORBIDDEN("No tiene permiso para eliminar esta cita.")
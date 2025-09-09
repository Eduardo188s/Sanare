from datetime import datetime, timedelta
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from .permissions import IsOwnerOrReadOnly
from .models import Cita, Clinica, Especialidad, Horario, Notificacion
from .serializers import (
    CitaSerializer,
    ClinicaSerializer,
    EspecialidadSerializer,
    HorarioSerializer,
    NotificacionSerializer,
)
from django.contrib.auth import get_user_model
User = get_user_model()

def generar_horarios_disponibles(hora_apertura, hora_cierre):
        horarios = []
        if not hora_apertura or not hora_cierre:
            return horarios
    
        current = datetime.combine(datetime.today(), hora_apertura)
        cierre = datetime.combine(datetime.today(), hora_cierre)

        while current < cierre:
            horarios.append(current.time())
            current += timedelta(minutes=30)
    
        return horarios

@api_view(['GET'])
@permission_classes([AllowAny])
def obtener_horarios_disponibles(request, clinica_id):
    fecha_str = request.query_params.get('fecha')
    if not fecha_str:
        return Response({"error": "Se requiere el parámetro fecha (YYYY-MM-DD)"},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({"error": "Formato de fecha inválido (YYYY-MM-DD)"},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        clinica = Clinica.objects.get(id=clinica_id)
    except Clinica.DoesNotExist:
        return Response({"error": "Clínica no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    if not clinica.hora_apertura or not clinica.hora_cierre:
        return Response({"error": "La clínica no tiene horario definido"},
                        status=status.HTTP_400_BAD_REQUEST)

    current = datetime.combine(fecha, clinica.hora_apertura)
    cierre = datetime.combine(fecha, clinica.hora_cierre)
    horarios = []
    while current < cierre:
        horarios.append(current.time())
        current += timedelta(minutes=30)

    citas = Cita.objects.filter(clinica=clinica, fecha=fecha)
    horarios_ocupados = [cita.hora for cita in citas]
    horarios_disponibles = [h.strftime("%H:%M") for h in horarios if h not in horarios_ocupados]

    return Response(horarios_disponibles)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def agendar_cita(request, medico_id):
    if not request.user.is_paciente:
        return Response({'error': 'Solo los pacientes pueden agendar citas.'},
                        status=status.HTTP_403_FORBIDDEN)
    citas_activas = Cita.objects.filter(paciente=request.user).count()
    if citas_activas >= 2:
        return Response({'error': 'No puedes tener más de 2 citas activas a la vez.'},
                        status=status.HTTP_400_BAD_REQUEST)
    
    fecha_str = request.data.get('fecha')
    hora_str = request.data.get('hora')
    motivo = request.data.get('motivo')
    clinica_id = request.data.get('clinica_id')

    if not all([fecha_str, hora_str, motivo, clinica_id]):
        return Response({"error": "Faltan datos para agendar la cita."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        fecha_dt = datetime.strptime(fecha_str, '%Y-%m-%d').date()
        hora_dt = datetime.strptime(hora_str, '%H:%M').time()
        medico = User.objects.get(id=medico_id)
        clinica = Clinica.objects.get(id=clinica_id)
    except (ValueError, User.DoesNotExist, Clinica.DoesNotExist):
        return Response({"error": "Datos inválidos o médico/clínica no encontrado."},
                        status=status.HTTP_400_BAD_REQUEST)

    if Cita.objects.filter(medico=medico, fecha=fecha_dt, hora=hora_dt).exists():
        return Response({"error": "Esta hora ya está ocupada para este médico."},
                        status=status.HTTP_400_BAD_REQUEST)

    cita = Cita.objects.create(
        paciente=request.user,
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
    if request.user.is_paciente:
        cita = get_object_or_404(Cita, id=cita_id, paciente=request.user)
    elif request.user.is_medico:
        cita = get_object_or_404(Cita, id=cita_id, medico=request.user)
    else:
        return Response({'error': 'No tienes un rol válido para cancelar citas.'},
                        status=status.HTTP_403_FORBIDDEN)

    cita.delete()
    return Response({'mensaje': 'Cita cancelada correctamente'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def obtener_citas(request):
    usuario = request.user
    if usuario.is_paciente:
        citas = Cita.objects.filter(paciente=usuario).order_by('-fecha', '-hora')
    elif usuario.is_medico:
        citas = Cita.objects.filter(medico=usuario).order_by('-fecha', '-hora')
    else:
        return Response({'error': 'Usuario no tiene un rol válido (paciente o médico).'}, status=status.HTTP_403_FORBIDDEN)

    serializer = CitaSerializer(citas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class ClinicaViewSet(viewsets.ModelViewSet):
    serializer_class = ClinicaSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_medico:
                return Clinica.objects.filter(medico_responsable=user)
            elif user.is_paciente:
                return Clinica.objects.all()
        return Clinica.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_medico:
            raise PermissionError("Sólo los médicos pueden crear consultorios.")
        
        if Clinica.objects.filter(medico_responsable=user).exists():
            raise PermissionError("Ya tienes una clínica asignada. No puedes crear otra.")
    
        serializer.save(medico_responsable=user)

class EspecialidadViewSet(viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer
    permission_classes = [AllowAny]

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        else:
            return [IsAuthenticated()]


    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_medico:
            return Horario.objects.filter(medico=user)
        return Horario.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_medico:
            serializer.save(medico=user)
        else:
            raise PermissionError("Solo los médicos pueden crear horarios.")

    def perform_update(self, serializer):
        user = self.request.user
        if user.is_medico and serializer.instance.medico == user:
            serializer.save()
        else:
            raise PermissionError("No tiene permiso para actualizar este horario.")

    def perform_destroy(self, instance):
        user = self.request.user
        if user.is_medico and instance.medico == user:
            instance.delete()
        else:
            raise PermissionError("No tiene permiso para eliminar este horario.")

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def my(self, request):
        user = request.user
        if user.is_paciente:
            citas = Cita.objects.filter(paciente=user).order_by('-fecha', '-hora')
        else:
            return Response({'error': 'Solo los pacientes pueden ver sus citas.'}, status=403)
        serializer = self.get_serializer(citas, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_paciente:
                return Cita.objects.filter(paciente=user)
            elif user.is_medico:
                return Cita.objects.filter(medico=user)
        return Cita.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionError("Debes iniciar sesión para agendar citas.")
        if user.is_paciente:
            serializer.save(paciente=user)
        else:
            raise PermissionError("Solo los pacientes pueden crear citas directamente.")

    def perform_update(self, serializer):
        user = self.request.user
        instance = self.get_object()
        if user == instance.paciente or (user.is_medico and user == instance.medico):
            serializer.save()
        else:
            raise PermissionError("No tiene permiso para actualizar esta cita.")

    def perform_destroy(self, instance):
        user = self.request.user
        if user == instance.paciente or (user.is_medico and user == instance.medico):
            instance.delete()
        else:
            raise PermissionError("No tiene permiso para eliminar esta cita.")
    
class NotificacionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='my', permission_classes=[IsAuthenticated])
    def my_notifications(self, request):
        user = request.user
        if not user.is_medico:
            return Response({"detail": "No eres médico"}, status=403)
        
        notifs = Notificacion.objects.filter(medico=user)
        serializer = self.get_serializer(notifs, many=True)
        return Response(serializer.data)
    
@api_view(['PATCH'])
def marcar_notificacion_leida(request, pk):
    try:
        notif = Notificacion.objects.get(pk=pk)
        notif.leida = True
        notif.save()
        return Response({"status": "ok"})
    except Notificacion.DoesNotExist:
        return Response({"error": "Notificación no encontrada"}, status=404)
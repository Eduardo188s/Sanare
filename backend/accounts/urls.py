from django.urls import path
from .views import RegisterMedicoView, RegisterPacienteView, UserProfileView
from .views import CustomTokenObtainPairView 
from .views_cedula import validar_cedula
from rest_framework_simplejwt.views import TokenRefreshView 

urlpatterns = [
    path('register/medico/', RegisterMedicoView.as_view(), name='register_medico'),
    path('register/paciente/', RegisterPacienteView.as_view(), name='register_paciente'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('cedula/<str:cedula>/', validar_cedula, name='validate_cedula'),
]
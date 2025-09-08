from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        'username', 'email', 'first_name', 'last_name',
        'is_medico', 'is_paciente', 'telefono', 'especialidad'
    )
    list_filter = (
        'is_medico', 'is_paciente', 'sexo', 'especialidad'
    )
    search_fields = ('username', 'email', 'first_name', 'last_name', 'telefono')

    fieldsets = UserAdmin.fieldsets + (
        ("Información adicional", {
            "fields": (
                'is_medico', 'is_paciente',
                'fecha_nacimiento', 'sexo', 'telefono', 'especialidad'
            )
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'first_name', 'last_name',
                'password1', 'password2',
                'is_medico', 'is_paciente',
                'fecha_nacimiento', 'sexo', 'telefono', 'especialidad'
            ),
        }),
    )
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = UserAdmin.list_display + ('is_medico', 'is_paciente',)
    list_filter = UserAdmin.list_filter + ('is_medico', 'is_paciente',)
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('is_medico', 'is_paciente',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('is_medico', 'is_paciente',)}),
    )

admin.site.register(User, CustomUserAdmin)

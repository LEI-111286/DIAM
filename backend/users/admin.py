from django.contrib import admin
from .models import Profile


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Perfil'


# Extender o UserAdmin para mostrar o Profile inline
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User


class UserAdmin(BaseUserAdmin):
    inlines = [ProfileInline]


# Re-registar o User com o novo UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

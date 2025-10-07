from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Patient, Doctor, Availability, Appointment


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    pass


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'dob')


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialty', 'phone')


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'start', 'end')


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'start', 'end', 'status', 'urgent')

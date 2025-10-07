from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError


class User(AbstractUser):
    is_patient = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)


class Patient(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=30, blank=True)
    dob = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Patient: {self.user.username}"


class Doctor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    specialty = models.CharField(max_length=120, blank=True)
    phone = models.CharField(max_length=30, blank=True)

    def __str__(self):
        return f"Dr. {self.user.get_full_name() or self.user.username} - {self.specialty}"


class Availability(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='availabilities')
    start = models.DateTimeField()
    end = models.DateTimeField()

    class Meta:
        ordering = ['start']

    def __str__(self):
        return f"{self.doctor} available {self.start} - {self.end}"


class Appointment(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    start = models.DateTimeField()
    end = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    urgent = models.BooleanField(default=False)

    class Meta:
        ordering = ['-start']

    def save(self, *args, **kwargs):
        # Ensure start/end are timezone-aware
        if self.start and timezone.is_naive(self.start):
            self.start = timezone.make_aware(self.start, timezone.get_current_timezone())
        if self.end and timezone.is_naive(self.end):
            self.end = timezone.make_aware(self.end, timezone.get_current_timezone())

        # urgency logic: if appointment is within 24 hours, mark urgent
        now = timezone.now()
        if self.start and (self.start - now).total_seconds() <= 24 * 3600:
            self.urgent = True
        else:
            self.urgent = False

        # conflict detection: simple overlapping check
        conflicts = Appointment.objects.filter(doctor=self.doctor, status='scheduled').exclude(pk=self.pk).filter(
            start__lt=self.end, end__gt=self.start
        )
        if conflicts.exists():
            raise ValidationError('Appointment conflicts with an existing scheduled appointment')

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Appointment {self.patient} with {self.doctor} at {self.start}"

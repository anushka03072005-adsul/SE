from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
# Registration endpoint
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    from .serializers import UserSerializer
    data = request.data.copy()
    # Only allow patient or doctor registration, not both at once
    is_patient = data.get('is_patient', 'true').lower() == 'true'
    is_doctor = data.get('is_doctor', 'false').lower() == 'true'
    data['is_patient'] = is_patient
    data['is_doctor'] = is_doctor
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        # Create Patient or Doctor profile if needed
        from .models import Patient, Doctor
        if is_patient:
            Patient.objects.get_or_create(user=user)
        if is_doctor:
            Doctor.objects.get_or_create(user=user)
        return Response({'success': True, 'user_id': user.id})
    return Response(serializer.errors, status=400)
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Patient, Doctor, Availability, Appointment
from .serializers import (
    UserSerializer, PatientSerializer, DoctorSerializer,
    AvailabilitySerializer, AppointmentSerializer
)

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.AllowAny]


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.AllowAny]


class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # set patient from authenticated user if they have a Patient profile
        user = request.user
        data = request.data.copy()
        try:
            patient = user.patient
            data['patient'] = patient.id
        except Exception:
            pass
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    user = request.user
    data = {
        'id': user.id,
        'username': user.username,
        'is_patient': getattr(user, 'is_patient', False),
        'is_doctor': getattr(user, 'is_doctor', False),
    }
    # include profile ids when present
    try:
        data['patient_id'] = user.patient.id
    except Exception:
        data['patient_id'] = None
    try:
        data['doctor_id'] = user.doctor.id
    except Exception:
        data['doctor_id'] = None
    return Response(data)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def analytics(request):
    # simple analytics: appointments per doctor and per day
    per_doctor = Doctor.objects.annotate(total_appointments=Count('appointments')).values('id', 'user__username', 'total_appointments')
    per_day = Appointment.objects.extra({'day': "date(start)"}).values('day').annotate(count=Count('id')).order_by('day')
    return Response({'per_doctor': list(per_doctor), 'per_day': list(per_day)})

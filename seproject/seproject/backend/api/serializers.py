from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Patient, Doctor, Availability, Appointment

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_patient', 'is_doctor', 'first_name', 'last_name')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Patient
        fields = ('id', 'user', 'phone', 'dob')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['is_patient'] = True
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        patient = Patient.objects.create(user=user, **validated_data)
        return patient


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Doctor
        fields = ('id', 'user', 'bio', 'specialty', 'phone')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['is_doctor'] = True
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ('id', 'doctor', 'start', 'end')


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        # patient is read-only; API will set it from the authenticated user when appropriate
        fields = ('id', 'patient', 'doctor', 'start', 'end', 'status', 'urgent', 'created_at')
        read_only_fields = ('patient', 'urgent', 'created_at')

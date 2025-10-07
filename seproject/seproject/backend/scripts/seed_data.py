import os
import django
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from api.models import Patient, Doctor, Availability, Appointment

User = get_user_model()


def create_user(username, email, password, is_doctor=False, is_patient=False, first_name='', last_name=''):
    if User.objects.filter(username=username).exists():
        return User.objects.get(username=username)
    user = User.objects.create_user(username=username, email=email, password=password,
                                    is_doctor=is_doctor, is_patient=is_patient,
                                    first_name=first_name, last_name=last_name)
    return user


def run():
    print('Seeding sample data...')

    # Create a doctor
    doc_user = create_user('dr_john', 'drjohn@example.com', 'password123', is_doctor=True, first_name='John', last_name='Doe')
    doctor, created = Doctor.objects.get_or_create(user=doc_user, defaults={'bio': 'Cardiologist with 10 years experience', 'specialty': 'Cardiology', 'phone': '555-0100'})

    # Create a patient
    pat_user = create_user('alice', 'alice@example.com', 'password123', is_patient=True, first_name='Alice', last_name='Smith')
    patient, created = Patient.objects.get_or_create(user=pat_user, defaults={'phone': '555-0200'})

    # Create availabilities for the next three days using timezone-aware datetimes
    now = timezone.now()
    for i in range(1, 4):
        start = now + timedelta(days=i, hours=9)
        end = start + timedelta(hours=1)
        Availability.objects.get_or_create(doctor=doctor, start=start, end=end)

    # Create one appointment (day 2, 9:00)
    appt_start = now + timedelta(days=2, hours=9)
    appt_end = appt_start + timedelta(minutes=30)
    try:
        Appointment.objects.get_or_create(patient=patient, doctor=doctor, start=appt_start, end=appt_end)
    except Exception as e:
        print('Appointment creation error:', e)

    print('Seeding complete.')


if __name__ == '__main__':
    run()

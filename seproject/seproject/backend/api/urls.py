from django.urls import path, include
from rest_framework import routers
from .views import (
    UserViewSet, PatientViewSet, DoctorViewSet,
    AvailabilityViewSet, AppointmentViewSet, analytics, me, register
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'availabilities', AvailabilityViewSet)
router.register(r'appointments', AppointmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', me, name='me'),
    path('register/', register, name='register'),
    path('analytics/', analytics, name='analytics'),
]

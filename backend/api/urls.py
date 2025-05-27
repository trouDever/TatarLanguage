from django.urls import path, include
from api.views import UserProfileView

urlpatterns = [
    path('v1/', include('djoser.urls')),
    path('v1/', include('djoser.urls.jwt')),
    path('v1/user/profile/', UserProfileView.as_view(), name='user-profile'),
]

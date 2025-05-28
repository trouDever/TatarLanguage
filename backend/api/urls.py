from django.urls import path, include
from .views import (OrganizationAPIView,
                    OrganizationListAPIView,
                    CourseListAPIView,
                    CourseAPIView)

urlpatterns = [
    path('v1/', include('djoser.urls')),
    path('v1/', include('djoser.urls.jwt')),
    path('v1/organization/me', OrganizationAPIView.as_view(),
         name='organization_me'),
    path('v1/organization/<int:pk>', OrganizationAPIView.as_view(),
         name='organization_detail'),
    path('v1/organization/<int:pk>/edit', OrganizationAPIView.as_view(),
         name='organization_edit'),
    path('v1/organization/', OrganizationListAPIView.as_view(),
         name='organization_list'),
    path('v1/course/', CourseListAPIView.as_view(), name='course_list'),
    path('v1/course/create', CourseAPIView.as_view(), name='course_create'),
    path('v1/course/<int:pk>', CourseAPIView.as_view(), name='course_detail'),
]

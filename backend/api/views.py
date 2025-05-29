from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from users.serializers import UserUpdateSerializer

User = get_user_model()


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'patch']

    def get_object(self):
        return self.request.user
from organizations.models import Organization, Course
from organizations.serializers import OrganizationSerializer, CourseSerializer
from rest_framework import views, permissions
from rest_framework.response import Response


class OrganizationAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk=None):
        try:
            if request.user.role == 'organization':
                organization = Organization.objects.get(owner=request.user)
                serializer = OrganizationSerializer(organization)

            organization = Organization.objects.get(pk=pk)
            serializer = OrganizationSerializer(organization)
            return Response(serializer.data)
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=404)

    def post(self, request, pk=None):
        if request.user.role != 'organization':
            return Response({'error': 'You do not have permission to create an organization'},
                            status=403)
        try:
            organization = Organization.objects.get(owner=request.user)
            serializer = OrganizationSerializer(organization,
                                                data=request.data,
                                                partial=True,
                                                context={'request': request})
            if serializer.is_valid():
                organization = serializer.save()
                return Response(OrganizationSerializer(organization).data)
        except Organization.DoesNotExist:
            serializer = OrganizationSerializer(data=request.data,
                                                context={'request': request})
            if serializer.is_valid():
                organization = serializer.save()
                return Response(OrganizationSerializer(organization).data, status=201)
        return Response(serializer.errors, status=400)



class OrganizationListAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        organizations = Organization.objects.all()
        serializer = OrganizationSerializer(organizations, many=True)
        return Response(serializer.data)


class CourseListAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


class CourseAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'organization':
            return Response({'error': 'You do not have permission to create a course'},
                            status=403)
        serializer = CourseSerializer(data=request.data,
                                      context={'request': request})
        if serializer.is_valid():
            course = serializer.save()
            return Response(CourseSerializer(course).data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request, pk=None):
        try:
            course = Course.objects.get(pk=pk)
            serializer = CourseSerializer(course)
            return Response(serializer.data)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=404)

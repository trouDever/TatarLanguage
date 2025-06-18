from rest_framework import generics, permissions, views, viewsets, mixins
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from django.contrib.auth import get_user_model
from .permissions import IsOrganizationOwner
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from users.serializers import UserUpdateSerializer, UserSerializer
from organizations.models import Organization, Course, Enrollment
from organizations.serializers import OrganizationSerializer, CourseSerializer, EnrollmentSerializer
from events.models import Event
from events.serializers import EventSerializer
from exams.models import Exam, Result
from exams.serializers import ExamSerializer, ResultSerializer, ExamCreateSerializer, SubmitExamSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

PERCENT_TO_PASS_EXAM = 60

User = get_user_model()


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'patch']

    def get_object(self):
        return self.request.user
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        return UserUpdateSerializer

class OrganizationAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(response_body=OrganizationSerializer)
    def get(self, request, pk=None):
        if request.user.role == 'organization' and pk is None:
            organization = get_object_or_404(Organization, owner=request.user)
        else:
            organization = get_object_or_404(Organization, pk=pk)
        serializer = OrganizationSerializer(organization)
        return Response(serializer.data)
    @swagger_auto_schema(request_body=OrganizationSerializer)
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


class CourseCreateAPIView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizationOwner]


class CourseDetailAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsOrganizationOwner]
    @swagger_auto_schema(request_body=CourseSerializer, responses={201: CourseSerializer, 400: 'Bad Request', 404: 'Course not found'})
    def post(self, request):
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


class EventViewSet(ReadOnlyModelViewSet):
    queryset = Event.objects.all().order_by('date')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizationOwner]

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all().order_by('level')
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizationOwner]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Exam.objects.none()
        if self.request.user.role == 'organization':
            return self.queryset.filter(author=self.request.user.organizations.first())
        return self.queryset
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return ExamCreateSerializer
        return ExamSerializer
    
@swagger_auto_schema(request_body=SubmitExamSerializer, methods=['post'])
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_exam(request):
    exam_id = request.data.get('exam_id')
    answers = request.data.get('answers', [])

    if not exam_id or not answers:
        return Response({'error': 'exam_id и answers обязательны'}, status=400)

    exam = get_object_or_404(Exam, id=exam_id)
    score = 0

    for answer in answers:
        question_number = answer['question_number']
        text = answer['text']
        if not question_number or not text:
            continue

        question = exam.questions.filter(number=question_number).first()
        if not question:
            continue

        selected_choice = question.choices.filter(text=text).first()
        if selected_choice and selected_choice.is_correct:
            score += question.point

    result_percent = score / exam.total_points * 100
    passed = result_percent >= PERCENT_TO_PASS_EXAM

    if passed:
        result = Result.objects.filter(user=request.user, exam=exam).first()
        if result:
            if result.score < score:
                result.score = score
                result.save()
            else:
                return Response({'result': 'already passed', 'score': result.score}, status=200)
        else:
            result = Result.objects.create(user=request.user, exam=exam, score=score)
    return Response({
        'result': 'passed' if passed else 'failed',
        'score': score,
        'percent': result_percent,
    }, status=200)

class ResultRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Result.objects.none()
        user = self.request.user
        return Result.objects.filter(user=user)
    
    def get_object(self):  
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
        return obj

class ResultListAPIView(generics.ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Result.objects.filter(user=user).order_by('-completed_at')


class EnrollmentViewSet(mixins.CreateModelMixin,
                        mixins.ListModelMixin,
                        viewsets.GenericViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)

from rest_framework import serializers
from .models import Exam, Result, Choice, Question


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text']
        read_only_fields = ['id']

    def validate_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("Текст варианта ответа не может быть пустым.")
        return value


class ChoiceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['text', 'is_correct']

    def validate_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("Текст варианта ответа не может быть пустым.")
        return value


class QuestionCreateSerializer(serializers.ModelSerializer):
    choices = ChoiceCreateSerializer(many=True)

    class Meta:
        model = Question
        fields = ['text', 'point', 'choices', 'number']
        read_only_fields = ['number']
        extra_kwargs = {
            'exam': {'required': False}
        }

    def validate_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("Текст вопроса не может быть пустым.")
        return value

    def validate_point(self, value):
        if value < 1 or value > 10:
            raise serializers.ValidationError("Баллы за вопрос должны быть от 1 до 10.")
        return value

    def validate_choices(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Должно быть минимум 2 варианта ответа.")
        if not any(choice['is_correct'] for choice in value):
            raise serializers.ValidationError("Хотя бы один вариант должен быть помечен как правильный.")
        return value

    def create(self, validated_data):
        choices_data = validated_data.pop('choices')
        question = Question.objects.create(**validated_data)
        for choice_data in choices_data:
            Choice.objects.create(question=question, **choice_data)
        return question


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'point', 'number', 'choices']
        read_only_fields = ['id', 'number']
        


class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'level', 'questions', 'author']


class ExamCreateSerializer(serializers.ModelSerializer):
    questions = QuestionCreateSerializer(many=True)

    class Meta:
        model = Exam
        fields = ['title', 'description', 'level', 'questions']
        read_only_fields = ['author']

    def create(self, validated_data):
        request = self.context.get('request')
        if request.user.role != 'organization':
            raise serializers.ValidationError("У вас нет прав для создания экзамена.")
        
        questions_data = validated_data.pop('questions')
        exam = Exam.objects.create(author=request.user.organizations.first(), **validated_data)
        for question_data in questions_data:
            choices_data = question_data.pop('choices')
            question = Question.objects.create(exam=exam, **question_data)
            for choice_data in choices_data:
                Choice.objects.create(question=question, **choice_data)
        exam.save()
        return exam


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'user', 'exam', 'score', 'completed_at']
        read_only_fields = ['user', 'completed_at', 'exam']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)


class SubmitAnswerSerializer(serializers.Serializer):
    question_number = serializers.IntegerField(help_text='Номер вопроса')
    text = serializers.CharField(help_text='Текст ответа')

class SubmitExamSerializer(serializers.Serializer):
    exam_id = serializers.IntegerField(help_text='ID экзамена')
    answers = SubmitAnswerSerializer(many=True, help_text='Список ответов на вопросы экзамена')

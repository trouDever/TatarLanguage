from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Organization(models.Model):
    owner = models.ForeignKey(User, models.CASCADE,
                              related_name='organizations')
    name = models.CharField('Название',
                            max_length=256,
                            unique=True,
                            null=False)
    addres = models.JSONField('Адрес', null=False, blank=True, default=dict)
    description = models.TextField('Описание', null=True, blank=True)
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)

    def __str__(self):
        return self.name


class Course(models.Model):
    LEVEL_CHOICES = [
        (1, 'A1'),
        (2, 'A2'),
        (3, 'B1'),
        (4, 'B2'),
        (5, 'C1'),
        (6, 'C2'),
    ]
    organization = models.ForeignKey(Organization, models.CASCADE,
                                     related_name='courses')
    name = models.CharField('Название', max_length=256, null=False)
    description = models.TextField('Описание', null=True, blank=True)
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    photo = models.ImageField('Фото',
                              upload_to='courses/',
                              null=True,
                              blank=True)
    start_date = models.DateField('Дата начала', null=True, blank=True)
    end_date = models.DateField('Дата окончания', null=True, blank=True)
    level = models.CharField('Уровень',
                             max_length=32,
                             choices=LEVEL_CHOICES,
                             validators=[
                                 MinValueValidator(1),
                                 MaxValueValidator(6)
                             ],
                             null=False, blank=False, default='1')

    def __str__(self):
        return self.name

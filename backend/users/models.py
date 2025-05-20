from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    patronymic = models.CharField(max_length=50, blank=True, null=True, verbose_name='Отчество')
    phone = models.CharField(max_length=15, blank=True, null=True, verbose_name='Телефон')
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return f"{self.last_name} {self.first_name} {self.patronymic}"

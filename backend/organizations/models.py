from django.db import models
from django.contrib.auth import get_user_model

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

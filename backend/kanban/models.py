from django.db import models

class CoreModelManager(models.Manager):
    def get_by_pk(self, pk: int):
        try:
            return self.get(pk=pk)
        except models.ObjectDoesNotExist:
            return None

class Timestamp(models.Model):
    updated_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        app_label = 'kanban'
        abstract = True

class Dictionary(models.Model):
    name = models.CharField(max_length=64)

    class Meta:
        app_label = 'kanban'
        abstract = True


class Board(Dictionary, Timestamp):
    index = models.PositiveSmallIntegerField(default=0)
    is_static = models.BooleanField(default=False)
    max_card = models.PositiveSmallIntegerField(default=None, null=True, blank=True)

    objects = CoreModelManager()

class Card(Timestamp):
    index = models.PositiveSmallIntegerField(default=0)
    board = models.ForeignKey(
        'kanban.Board',
        on_delete=models.DO_NOTHING
    )
    description = models.TextField()

    objects = CoreModelManager()
from django.db import models

class CoreModelManager(models.Manager):
    def get_queryset(self):
        return super(CoreModelManager, self).get_queryset().filter(deleted_at__isnull=True)

    def get_by_pk(self, pk: int, raise_exception: bool = True):
        try:
            return self.get(pk=pk)
        except models.ObjectDoesNotExist as err:
            if raise_exception:
                raise err
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

    class Meta:
        ordering = ['index']

    def move(self, new_index, old_index):
        self.index = new_index
        self.save()

        if old_index is not None:
            old_boards = Board.objects.filter(
                index__gte=old_index,
                deleted_at__isnull=True
            ).exclude(id=self.pk).order_by('index')

            changed_index = old_index - 1
            for board in old_boards:
                if changed_index > 0:
                    board.index = changed_index
                    board.save()

                changed_index -= 1

        new_boards = Board.objects.filter(
            index__gte=new_index,
            deleted_at__isnull=True
        ).exclude(id=self.pk).order_by('index')

        changed_index = new_index + 1
        for card in new_boards:
            card.index = changed_index
            card.save()
            changed_index += 1

class Card(Timestamp):
    index = models.PositiveSmallIntegerField(default=0)
    board = models.ForeignKey(
        'kanban.Board',
        related_name='card_board',
        on_delete=models.DO_NOTHING
    )
    description = models.TextField()

    objects = CoreModelManager()

    class Meta:
        ordering = ['index']

    def move(self, index, new_board_id, old_index = None, old_board_id = None):
        self.board_id = new_board_id
        self.index = index
        self.save()

        if old_index is not None and old_board_id is not None:
            old_cards = Card.objects.filter(
                board_id=old_board_id,
                index__gte=old_index,
                deleted_at__isnull=True
            ).exclude(id=self.id).order_by('index')

            changed_index = old_index - 1
            for card in old_cards:
                if changed_index > 0:
                    card.index = changed_index
                    card.save()

                changed_index -= 1

        new_cards = Card.objects.filter(
            board_id=new_board_id,
            index__gte=index,
            deleted_at__isnull=True
        ).exclude(id=self.id).order_by('index')

        changed_index = index + 1
        for card in new_cards:
            card.index = changed_index
            card.save()
            changed_index += 1
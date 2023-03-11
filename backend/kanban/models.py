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
    max_card = models.PositiveSmallIntegerField(default=None, null=True, blank=True)

    objects = CoreModelManager()

    class Meta:
        ordering = ['index']

    def get_last_index(self):
        last_board = Board.objects.all().order_by('-index').first()

        if isinstance(last_board, Board):
            return last_board.index

        return Board.objects.count()

    @property
    def is_static(self):
        last_index = self.get_last_index()
        return self.index in [0, last_index]

    def move(self, new_index, old_index=None):
        if new_index < 0 or self.get_last_index() < new_index:
            return False, "Wprowadzono nieprawidłowy index."

        print(new_index)
        if old_index == 0 \
                or new_index == 0 \
                or old_index == None and new_index == self.get_last_index() + 1 \
                or old_index and new_index == self.get_last_index() \
                or old_index == self.get_last_index():
            return False, "Nie możesz przenieść tej tablicy w te miejsce."

        if old_index is not None:
            if new_index == 0:
                new_index += 1

            if new_index == self.get_last_index():
                new_index -= 1

        self.index = new_index
        self.save()

        if old_index is not None:
            old_boards = Board.objects.filter(
                index__gte=old_index,
                deleted_at__isnull=True
            ).exclude(id=self.pk).order_by('index')

            changed_index = old_index
            for board in old_boards:
                if changed_index >= 0:
                    board.index = changed_index
                    board.save()

                changed_index += 1

        new_boards = Board.objects.filter(
            index__gte=new_index,
            deleted_at__isnull=True
        ).exclude(id=self.pk).order_by('index')

        changed_index = new_index + 1
        for board in new_boards:
            board.index = changed_index
            board.save()
            changed_index += 1

        return True, "Tablica została przeniesiona poprawnie."


class Card(Timestamp):
    index = models.PositiveSmallIntegerField(default=0)
    board = models.ForeignKey(
        'kanban.Board',
        related_name='card_board',
        on_delete=models.DO_NOTHING
    )
    row = models.ForeignKey(
        'kanban.Row',
        related_name='card_row',
        on_delete=models.DO_NOTHING
    )
    description = models.TextField()

    objects = CoreModelManager()

    class Meta:
        ordering = ['index']

    def move(self, index, new_board_id, old_index=None, old_board_id=None):
        if index < 0 or Card.objects.count() - 1 < index:
            return False, "Wprowadzono nieprawidłowy index."

        self.board_id = new_board_id
        self.index = index
        self.save()

        if old_index is not None and old_board_id is not None:
            old_cards = Card.objects.filter(
                board_id=old_board_id,
                index__gte=old_index,
                deleted_at__isnull=True
            ).exclude(id=self.id).order_by('index')

            changed_index = old_index
            for card in old_cards:
                if changed_index >= 0:
                    card.index = changed_index
                    card.save()

                changed_index += 1

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

        return True, "Wpis został przeniesiony poprawnie."


class Row(Dictionary, Timestamp):
    index = models.PositiveSmallIntegerField(default=0)
    objects = CoreModelManager()

    class Meta:
        ordering = ['index']

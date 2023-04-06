from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.files.storage import FileSystemStorage


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
    name = models.CharField(max_length=32)

    class Meta:
        app_label = 'kanban'
        abstract = True


class Board(Dictionary, Timestamp):
    index = models.PositiveSmallIntegerField(default=0)
    min_card = models.PositiveSmallIntegerField(default=None, null=True, blank=True)
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

        if old_index == 0 \
                or new_index == 0 \
                or old_index is None and new_index == self.get_last_index() + 1 \
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
    is_locked = models.BooleanField(default=False)
    is_card_completed = models.BooleanField(default=False)
    is_card_finished = models.BooleanField(default=False)
    are_children_collapsed=models.BooleanField(default=True)
    are_carditems_collapsed=models.BooleanField(default=True)
    has_bug = models.BooleanField(default=False)
    #Twoje rozwiązanie mi nie działało poprawnie napisalem na szybko swoje
    are_children_collapsed = models.BooleanField(default=True)

    def save(self,*args, **kwargs):
        items = CardItem.objects.filter(card_id=self.id)
        print(items )
        if items:
            all_completed = not items.filter(is_done=False).exists()
            self.is_card_completed = all_completed
        self.is_card_finished = (self.board == Board.objects.all().order_by('-index').first())
        super(Card, self).save(*args, **kwargs)

    board = models.ForeignKey(
        'kanban.Board',
        related_name='card_board',
        on_delete=models.DO_NOTHING
    )
    row = models.ForeignKey(
        'kanban.Row',
        related_name='card_row',
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING
    )
    parent_card = models.ForeignKey(
        'kanban.Card',
        related_name='card_parent_card',
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING
    )
    description = models.TextField()
    color = models.CharField(max_length=7, default="#FFFFFF")
    user = models.ForeignKey(
        'kanban.User',
        related_name='card_user',
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING
    )
    users = models.ManyToManyField(
        'kanban.User',
        related_name='card_users',
        blank=True)
    restricted_boards = models.ManyToManyField(
        'kanban.Board',
        related_name='card_board_restricted',
        blank=True,
        null = False,

    )

    objects = CoreModelManager()

    class Meta:
        ordering = ['index']

    def move(self, index, new_board_id, new_row_id, old_index=None, old_board_id=None, old_row_id=None):
        if index < 0 or Card.objects.count() - 1 < index:
            return False, "Wprowadzono nieprawidłowy index."

        self.row_id = new_row_id
        self.board_id = new_board_id
        self.index = index
        self.save()

        if old_index is not None and old_board_id and old_row_id is not None:
            old_cards = Card.objects.filter(
                row_id=old_row_id,
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
            row_id=new_row_id,
            board_id=new_board_id,
            index__gte=index,
            deleted_at__isnull=True
        ).exclude(id=self.id).order_by('index')

        changed_index = index + 1
        for card in new_cards:
            card.index = changed_index
            card.save()
            changed_index += 1

        CardMoveTimeline.objects.create(
            card=self,
            board_id=new_board_id,
            row_id=new_row_id
        )
        return True, "Wpis został przeniesiony poprawnie."


class Row(Dictionary, Timestamp):
    objects = CoreModelManager()
    is_collapsed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-id']

    def get_last_index(self):
        last_row = Row.objects.all().order_by('-index').first()

        if isinstance(last_row, Row):
            return last_row.index

        return Row.objects.count()

    def move(self, new_index, old_index=None):
        if new_index < 0 or self.get_last_index() < new_index:
            return False, "Wprowadzono nieprawidłowy index."

        if old_index is not None:
            if new_index == 0:
                new_index += 1

            if new_index == self.get_last_index():
                new_index -= 1

        self.index = new_index
        self.save()

        if old_index is not None:
            old_rows = Row.objects.filter(
                index__gte=old_index,
                deleted_at__isnull=True
            ).exclude(id=self.pk).order_by('index')

            changed_index = old_index
            for row in old_rows:
                if changed_index >= 0:
                    row.index = changed_index
                    row.save()

                changed_index += 1

        new_rows = Row.objects.filter(
            index__gte=new_index,
            deleted_at__isnull=True
        ).exclude(id=self.pk).order_by('index')

        changed_index = new_index + 1
        for row in new_rows:
            row.index = changed_index
            row.save()
            changed_index += 1

        return True, "Tablica została przeniesiona poprawnie."


class UserManager(CoreModelManager, BaseUserManager):
    model_name = 'Użytkownik'

    def create_user(self, username, password=None, email=None):
        user = self.model(
            username=username,
            email=email
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password, email):
        user = self.create_user(username=username, password=password, email=email)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(Timestamp, AbstractUser):
    avatar = models.CharField(default="http://localhost:8000/media/generic-avatar.png", max_length=200)
    image = models.ImageField(default=None, blank=True, null=True)
    objects = UserManager()


class Parameter(Timestamp, Dictionary):
    value = models.SmallIntegerField(default=0)
    objects = UserManager()


class CardItem(Dictionary, Timestamp):
    card = models.ForeignKey(
        'kanban.Card',
        related_name='card_item',
        null=False,
        blank=True,
        on_delete=models.DO_NOTHING

    )
    is_done = models.BooleanField(default=False)

    objects = CoreModelManager()

class CardMoveTimeline(Timestamp):
    card = models.ForeignKey(
        'kanban.Card',
        related_name='card_move_timeline',
        on_delete=models.DO_NOTHING

    )

    board = models.ForeignKey(
        'kanban.Board',
        on_delete=models.DO_NOTHING
    )

    row = models.ForeignKey(
        'kanban.Row',
        on_delete=models.DO_NOTHING
    )

    created_at = models.DateTimeField(auto_now_add=True)
from django.forms import ModelForm
from kanban.models import User

class AvatarUpload(ModelForm):
    class Meta:
        model = User
        exclude = ('deleted_at',)
from kanban.models import User
from kanban.serializers.remaining_user_assignment_serializer import RemainingSerializer


def remaining_helper():
    occurrences = RemainingSerializer(User.objects.all(), many=True).data
    result = RemainingSerializer(User.objects.none(), many=True).data
    for user in occurrences:
        for number in range(user['remaining_assignments']):
            result.append(user)
    return result

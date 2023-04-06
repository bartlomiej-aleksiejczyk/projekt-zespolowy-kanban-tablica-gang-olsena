from django.test import TestCase
from kanban.models import Parameter
from rest_framework import serializers
from kanban.serializers.parameter_serializer import ParameterSerializer


class TestParameterSerializer(TestCase):
    def setUp(self):
        self.serializer = ParameterSerializer()
        self.test="bajo jajo"

    def test_valid_input(self):
        valid_input = {
            'id':1,
            'name': "3",
        }
        serializer = ParameterSerializer(data=valid_input)
        print(serializer)
        self.assertEqual(serializer.is_valid(), True)
        result = self.serializer.validate(valid_input)
        self.assertEqual(result, valid_input)

    def test_invalid_input(self):

        invalid_input = {
            'name': '',
            'value': '',
            "dssfdfs": 'dfdsfds'
        }
        print(self.test)
        serializer = ParameterSerializer(data=invalid_input)
        self.assertEqual(serializer.is_valid(), False)

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

class SimpleTest(TestCase):
    def test_home_status_code(self):
        response = self.client.get('/')
        self.assertIn(response.status_code, [200, 301, 302, 404])

    def test_user_creation(self):
        User = get_user_model()
        user = User.objects.create(username="testuser")
        self.assertEqual(user.username, "testuser")

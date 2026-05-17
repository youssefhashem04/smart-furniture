from django.core.management.base import BaseCommand
from faker import Faker
from users.models import User
from products.models import Product
import random

fake = Faker()


class Command(BaseCommand):
    help = "Generate fake data for testing"

    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting old data...")

        Product.objects.all().delete()

        # seller users
        sellers = []

        for i in range(5):
            username = f"seller{i}"

            seller, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@gmail.com",
                    "role": "seller",
                }
            )

            seller.set_password("12345678")
            seller.save()
            sellers.append(seller)

        # normal users
        for i in range(10):
            username = f"user{i}"

            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@gmail.com",
                    "role": "customer",
                }
            )

            user.set_password("12345678")
            user.save()

        categories = [
            "Chairs",
            "Desks",
            "Tables",
            "Beds",
            "Sofas",
            "Wardrobes",
            "Cabinets",
            "Bookshelves",
            "TV Units",
            "Dining Sets",
            "Office Furniture",
            "Outdoor Furniture",
        ]

        self.stdout.write("Creating products...")

        for i in range(50):
            Product.objects.create(
                seller=random.choice(sellers),
                name=fake.company(),
                price=random.randint(500, 15000),
                rating=round(random.uniform(3.5, 5.0), 1),
                category=random.choice(categories),
                description=fake.text(max_nb_chars=200),
                has_custom_size=random.choice([True, False]),
            )

        self.stdout.write(
            self.style.SUCCESS("Fake data generated successfully 🔥")
        )
        
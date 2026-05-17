from django.db import models
from django.conf import settings
from .utility import *
from users.models import User

class Product(models.Model):
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')

    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    rating_count = models.IntegerField(default=0)

    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    has_custom_size = models.BooleanField(default=False)

    image = models.ImageField(upload_to="products/", null=True, blank=True)

    def __str__(self):
        return self.name


    
    
def update_product_rating(product):
    reviews = product.reviews.all()

    if not reviews.exists():
        product.rating = 0
        product.rating_count = 0
    else:
        total = sum(r.rating for r in reviews)
        product.rating = round(total / reviews.count(), 1)
        product.rating_count = reviews.count()

    product.save()

class Review(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    rating = models.IntegerField(
        choices=[
            (1, '1 Star'),
            (2, '2 Stars'),
            (3, '3 Stars'),
            (4, '4 Stars'),
            (5, '5 Stars'),
        ]
    )

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
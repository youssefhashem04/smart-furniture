from rest_framework import serializers
from .models import Product, Review


# ⭐ Review Serializer
class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(
        source='user.username',
        read_only=True
    )

    class Meta:
        model = Review
        fields = [
            'id',
            'user',
            'user_name',
            'rating',
            'comment',
            'created_at',
        ]
        read_only_fields = [
            'user',
            'created_at',
        ]

class ProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(
        source='seller.username',
        read_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'seller_name',
            'name',
            'price',
            'rating',
            'rating_count',
            'category',
            'description',
            'has_custom_size',
            'image',  # ✅ ده المهم
        ]
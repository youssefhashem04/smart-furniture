from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Review, update_product_rating

@receiver(post_save, sender=Review)
def review_saved(sender, instance, **kwargs):
    update_product_rating(instance.product)

@receiver(post_delete, sender=Review)
def review_deleted(sender, instance, **kwargs):
    update_product_rating(instance.product)
from django.urls import path
from .views import (
    ProductListCreateView,
    ProductDetailView,
    SellerProductListView,
    ProductUpdateDeleteView,
    ProductReviewCreateView,
)

urlpatterns = [
    # All products + create product
    path(
        '',
        ProductListCreateView.as_view(),
        name='product-list-create'
    ),

    # Seller products
    path(
        'seller-products/',
        SellerProductListView.as_view(),
        name='seller-products'
    ),

    # Product details
    path(
        '<int:pk>/',
        ProductDetailView.as_view(),
        name='product-detail'
    ),

    # Update + Delete product
    path(
        'manage/<int:pk>/',
        ProductUpdateDeleteView.as_view(),
        name='product-manage'
    ),

    # ⭐ Product Reviews
    path(
        '<int:product_id>/reviews/',
        ProductReviewCreateView.as_view(),
        name='product-reviews'
    ),
]
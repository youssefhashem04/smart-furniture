from django.urls import path
from .views import CreateOrderView, MyOrdersView, AllOrdersView, OrderStatusUpdateView

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='create-order'),
    path('my-orders/', MyOrdersView.as_view(), name='my-orders'),
    path('all/', AllOrdersView.as_view(), name='all-orders'),
    path('update-status/<int:pk>/', OrderStatusUpdateView.as_view(), name='update-order-status'),
]
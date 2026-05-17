from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Order
from .serializers import OrderSerializer, OrderStatusUpdateSerializer


class CreateOrderView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}


class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items').order_by('-created_at')


class AllOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
            return Order.objects.all().prefetch_related('items').order_by('-created_at')

        if user.role == 'seller':
            seller_products = user.products.all()
            return Order.objects.filter(items__product__in=seller_products).distinct().prefetch_related('items').order_by('-created_at')

        return Order.objects.none()


class OrderStatusUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        order = super().get_object()
        user = self.request.user

        if user.role == 'admin':
            return order

        if user.role == 'seller':
            seller_products = user.products.all()
            if order.items.filter(product__in=seller_products).exists():
                return order

        raise PermissionDenied("You do not have permission to update this order")
from rest_framework import generics, permissions, parsers, filters
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend

from .models import Product
from .serializers import ProductSerializer
from .permissions import IsSellerOrAdmin
from .models import Review
from .serializers import ReviewSerializer


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer

    parser_classes = [
        parsers.MultiPartParser,
        parsers.FormParser,
        parsers.JSONParser
    ]

    # 🔥 Filters
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    # فلترة مباشرة
    filterset_fields = [
        'category',
        'has_custom_size',
    ]

    # Search بالاسم والوصف
    search_fields = [
        'name',
        'description',
    ]

    # ترتيب حسب السعر أو التقييم
    ordering_fields = [
        'price',
        'rating',
        'id',
    ]

    ordering = ['-id']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsSellerOrAdmin()]
        return [permissions.AllowAny()]

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        print(self.request.FILES)  # 👈 لازم تشوف الصورة هنا
        product = serializer.save(seller=self.request.user)


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}


class SellerProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role not in ['seller', 'admin']:
            raise PermissionDenied(
                "Only seller or admin can view seller products"
            )

        if user.role == 'admin':
            return Product.objects.all().order_by('-id')

        return Product.objects.filter(
            seller=user
        ).order_by('-id')

    def get_serializer_context(self):
        return {'request': self.request}


class ProductUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    parser_classes = [
        parsers.MultiPartParser,
        parsers.FormParser,
        parsers.JSONParser
    ]

    def get_serializer_context(self):
        return {'request': self.request}

    def get_object(self):
        product = super().get_object()
        user = self.request.user

        if user.role == 'admin':
            return product

        if user.role == 'seller' and product.seller == user:
            return product

        raise PermissionDenied(
            "You do not have permission to manage this product"
        )
    
class ProductReviewCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Review.objects.filter(
            product_id=product_id
        ).order_by('-created_at')

    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        product = Product.objects.get(id=product_id)

        # منع المستخدم من تكرار نفس الريفيو
        if Review.objects.filter(
            product=product,
            user=self.request.user
        ).exists():
            raise PermissionDenied(
                "You already reviewed this product"
            )

        review = serializer.save(
            user=self.request.user,
            product=product
        )

        # تحديث متوسط التقييم
        reviews = product.reviews.all()

        total_rating = sum(
            review.rating for review in reviews
        )

        product.rating_count = reviews.count()
        product.rating = total_rating / reviews.count()
        product.save()
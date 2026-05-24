from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Category, Product, Order, Review, BlogPost
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    OrderSerializer, CreateOrderSerializer, ReviewSerializer, BlogPostSerializer,
)


class CategoryListView(generics.ListAPIView):
    """GET /api/categories/ — Listar todas as categorias."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class IsStaffOrReadOnly(permissions.BasePermission):
    """Permite leitura a todos, mas escrita (POST/PUT/DELETE) só a Staff."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

class ProductListView(generics.ListCreateAPIView): # Mudou para ListCreateAPIView
    """GET /api/products/ — Listar produtos | POST /api/products/ — Criar produto"""
    serializer_class = ProductListSerializer
    permission_classes = [IsStaffOrReadOnly] # Mudou de AllowAny para IsStaffOrReadOnly

    def get_queryset(self):
        queryset = Product.objects.all()
        category_slug = self.request.query_params.get('category')
        search = self.request.query_params.get('search')

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/<slug>/ — Detalhe do produto com reviews."""
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    """POST /api/reviews/ — Criar review (apenas autenticados)."""
    product_id = request.data.get('product')
    rating = request.data.get('rating')
    comment = request.data.get('comment', '')

    if not product_id or not rating:
        return Response(
            {'error': 'product e rating são obrigatórios.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verificar se já existe review deste user para este produto
    if Review.objects.filter(user=request.user, product_id=product_id).exists():
        return Response(
            {'error': 'Já submeteu uma avaliação para este produto.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        review = Review.objects.create(
            user=request.user,
            product_id=product_id,
            rating=rating,
            comment=comment,
        )
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """POST /api/orders/ — Criar encomenda a partir do carrinho."""
    serializer = CreateOrderSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        order = serializer.save()
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderListView(generics.ListAPIView):
    """GET /api/orders/ — Histórico de encomendas do utilizador."""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class BlogPostListView(generics.ListAPIView):
    """GET /api/blog/ — Listar artigos do blog."""
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [AllowAny]


class BlogPostDetailView(generics.RetrieveAPIView):
    """GET /api/blog/<slug>/ — Detalhe de artigo."""
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

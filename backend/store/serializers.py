from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Product, Order, OrderItem, Review, BlogPost


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image']


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'username', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'username', 'created_at']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer para listagem de produtos (sem reviews)."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'stock',
            'category', 'category_name', 'image', 'origin', 'average_rating',
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalhe do produto (com reviews e categoria nested)."""
    category = CategorySerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'stock',
            'category', 'image', 'origin', 'nutritional_info',
            'average_rating', 'reviews', 'created_at',
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price_at_purchase', 'subtotal']
        read_only_fields = ['id', 'price_at_purchase', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'username', 'status', 'total', 'created_at',
            'shipping_address', 'shipping_city', 'shipping_postal_code', 'items',
        ]
        read_only_fields = ['id', 'username', 'status', 'total', 'created_at']


class CreateOrderSerializer(serializers.Serializer):
    """Serializer para criar encomendas a partir do carrinho."""
    shipping_address = serializers.CharField(max_length=255)
    shipping_city = serializers.CharField(max_length=100)
    shipping_postal_code = serializers.CharField(max_length=20)
    items = serializers.ListField(child=serializers.DictField(), min_length=1)

    def validate_items(self, items):
        for item in items:
            if 'product_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError(
                    'Cada item deve ter product_id e quantity.'
                )
            try:
                product = Product.objects.get(id=item['product_id'])
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    f"Produto com id {item['product_id']} não existe."
                )
            if int(item['quantity']) > product.stock:
                raise serializers.ValidationError(
                    f"Stock insuficiente para {product.name}."
                )
        return items

    def create(self, validated_data):
        user = self.context['request'].user
        items_data = validated_data.pop('items')

        order = Order.objects.create(user=user, **validated_data)

        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            quantity = int(item_data['quantity'])
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price_at_purchase=product.price,
            )
            # Atualizar stock
            product.stock -= quantity
            product.save()

        return order


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'content', 'excerpt', 'image', 'author_name', 'created_at']

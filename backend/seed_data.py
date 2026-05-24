"""
Script para popular a base de dados com dados de exemplo.
Executar com: python manage.py shell < seed_data.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'legumes_do_campo.settings')
django.setup()

from django.contrib.auth.models import User
from store.models import Category, Product, Review, BlogPost, Order, OrderItem

print("🌱 A popular a base de dados...")

# --- Criar utilizadores ---
admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@legumesdocampo.pt',
        'first_name': 'Administrador',
        'last_name': 'Sistema',
        'is_staff': True,
        'is_superuser': True,
    }
)
if created:
    admin_user.set_password('admin123')
    admin_user.save()
    print("  ✅ Criado user admin (admin / admin123)")

cliente, created = User.objects.get_or_create(
    username='cliente',
    defaults={
        'email': 'cliente@email.pt',
        'first_name': 'Maria',
        'last_name': 'Silva',
    }
)
if created:
    cliente.set_password('cliente123')
    cliente.save()
    # Atualizar perfil
    cliente.profile.phone = '912345678'
    cliente.profile.address = 'Rua das Flores, 42'
    cliente.profile.city = 'Lisboa'
    cliente.profile.postal_code = '1200-100'
    cliente.profile.save()
    print("  ✅ Criado user cliente (cliente / cliente123)")

# --- Criar categorias ---
categories_data = [
    {'name': 'Feijão', 'description': 'Variedades de feijão de produção nacional, ricos em proteína vegetal e fibra.'},
    {'name': 'Grão-de-bico', 'description': 'Grão-de-bico seco e cozido, perfeito para hummus, saladas e estufados.'},
    {'name': 'Lentilhas', 'description': 'Lentilhas de diversas cores e tamanhos, cozinham rapidamente e são muito versáteis.'},
    {'name': 'Ervilhas', 'description': 'Ervilhas secas e frescas, ideais para sopas, purés e acompanhamentos.'},
    {'name': 'Favas', 'description': 'Favas secas tradicionais portuguesas, ricas em nutrientes e sabor.'},
    {'name': 'Misturas', 'description': 'Combinações equilibradas de leguminosas para receitas variadas e refeições completas.'},
]

categories = {}
for cat_data in categories_data:
    cat, created = Category.objects.get_or_create(
        name=cat_data['name'],
        defaults={'description': cat_data['description']}
    )
    categories[cat.name] = cat
    if created:
        print(f"  ✅ Categoria: {cat.name}")

# --- Criar produtos ---
products_data = [
    # Feijão
    {
        'name': 'Feijão Encarnado',
        'description': 'Feijão encarnado de produção nacional, ideal para feijoadas e chili. Textura macia e sabor suave após cozedura.',
        'price': 3.49,
        'stock': 150,
        'category': 'Feijão',
        'origin': 'Alentejo, Portugal',
        'nutritional_info': 'Por 100g: 333 kcal | Proteína: 22g | Fibra: 15g | Ferro: 6.7mg',
    },
    {
        'name': 'Feijão Branco',
        'description': 'Feijão branco cremoso, perfeito para sopas tradicionais portuguesas e saladas frias.',
        'price': 3.29,
        'stock': 200,
        'category': 'Feijão',
        'origin': 'Ribatejo, Portugal',
        'nutritional_info': 'Por 100g: 333 kcal | Proteína: 21g | Fibra: 16g | Cálcio: 240mg',
    },
    {
        'name': 'Feijão Preto',
        'description': 'Feijão preto seco de alta qualidade, essencial na culinária brasileira e mexicana.',
        'price': 3.99,
        'stock': 100,
        'category': 'Feijão',
        'origin': 'Trás-os-Montes, Portugal',
        'nutritional_info': 'Por 100g: 341 kcal | Proteína: 21g | Fibra: 16g | Magnésio: 171mg',
    },
    # Grão-de-bico
    {
        'name': 'Grão-de-bico Graúdo',
        'description': 'Grão-de-bico graúdo, excelente para hummus caseiro, saladas quentes e cozidos à portuguesa.',
        'price': 4.49,
        'stock': 120,
        'category': 'Grão-de-bico',
        'origin': 'Alentejo, Portugal',
        'nutritional_info': 'Por 100g: 364 kcal | Proteína: 19g | Fibra: 17g | Folato: 557μg',
    },
    {
        'name': 'Grão-de-bico Miúdo',
        'description': 'Grão-de-bico miúdo, cozinha mais rápido e é ideal para sopas e cremes.',
        'price': 3.99,
        'stock': 90,
        'category': 'Grão-de-bico',
        'origin': 'Beira Interior, Portugal',
        'nutritional_info': 'Por 100g: 364 kcal | Proteína: 19g | Fibra: 17g | Zinco: 3.4mg',
    },
    # Lentilhas
    {
        'name': 'Lentilhas Verdes',
        'description': 'Lentilhas verdes que mantêm a forma após cozedura, perfeitas para saladas e acompanhamentos.',
        'price': 3.79,
        'stock': 130,
        'category': 'Lentilhas',
        'origin': 'Alentejo, Portugal',
        'nutritional_info': 'Por 100g: 352 kcal | Proteína: 25g | Fibra: 11g | Ferro: 7.5mg',
    },
    {
        'name': 'Lentilhas Castanhas',
        'description': 'Lentilhas castanhas tradicionais, muito versáteis na cozinha. Ideais para sopas e dals.',
        'price': 3.49,
        'stock': 160,
        'category': 'Lentilhas',
        'origin': 'Ribatejo, Portugal',
        'nutritional_info': 'Por 100g: 353 kcal | Proteína: 25g | Fibra: 11g | Potássio: 677mg',
    },
    # Ervilhas
    {
        'name': 'Ervilhas Secas',
        'description': 'Ervilhas secas inteiras de produção biológica, excelentes para sopas cremosas e purés.',
        'price': 2.99,
        'stock': 180,
        'category': 'Ervilhas',
        'origin': 'Minho, Portugal',
        'nutritional_info': 'Por 100g: 341 kcal | Proteína: 25g | Fibra: 25g | Vitamina K: 14.5μg',
    },
    {
        'name': 'Ervilhas Partidas',
        'description': 'Ervilhas amarelas partidas, cozinham rapidamente e criam sopas naturalmente cremosas.',
        'price': 2.79,
        'stock': 140,
        'category': 'Ervilhas',
        'origin': 'Alentejo, Portugal',
        'nutritional_info': 'Por 100g: 341 kcal | Proteína: 25g | Fibra: 25g | Ferro: 4.4mg',
    },
    # Favas
    {
        'name': 'Favas Secas',
        'description': 'Favas secas tradicionais, um clássico da gastronomia portuguesa. Ideais com enchidos ou em açordas.',
        'price': 4.29,
        'stock': 80,
        'category': 'Favas',
        'origin': 'Algarve, Portugal',
        'nutritional_info': 'Por 100g: 341 kcal | Proteína: 26g | Fibra: 25g | Manganês: 1.6mg',
    },
    # Misturas
    {
        'name': 'Mix Proteico 5 Leguminosas',
        'description': 'Mistura equilibrada de feijão, grão, lentilhas, ervilhas e favas. Refeição completa numa só embalagem.',
        'price': 5.49,
        'stock': 70,
        'category': 'Misturas',
        'origin': 'Portugal',
        'nutritional_info': 'Por 100g: 345 kcal | Proteína: 23g | Fibra: 18g | 5 tipos de leguminosas',
    },
    {
        'name': 'Mix Sopa Caseira',
        'description': 'Combinação de lentilhas, ervilhas e feijão branco, pré-selecionados para uma sopa perfeita.',
        'price': 4.99,
        'stock': 90,
        'category': 'Misturas',
        'origin': 'Portugal',
        'nutritional_info': 'Por 100g: 340 kcal | Proteína: 22g | Fibra: 17g | 3 tipos de leguminosas',
    },
]

products = {}
for prod_data in products_data:
    category = categories[prod_data.pop('category')]
    product, created = Product.objects.get_or_create(
        name=prod_data['name'],
        defaults={**prod_data, 'category': category}
    )
    products[product.name] = product
    if created:
        print(f"  ✅ Produto: {product.name} ({category.name})")

# --- Criar reviews ---
reviews_data = [
    {'user': cliente, 'product': 'Feijão Encarnado', 'rating': 5, 'comment': 'Excelente qualidade! O feijão cozinha muito bem e fica com um sabor fantástico na feijoada.'},
    {'user': cliente, 'product': 'Grão-de-bico Graúdo', 'rating': 4, 'comment': 'Muito bom para fazer hummus. Grão graúdo e de boa qualidade.'},
    {'user': cliente, 'product': 'Lentilhas Verdes', 'rating': 5, 'comment': 'As melhores lentilhas que já comprei. Mantêm a forma e são ótimas em saladas.'},
    {'user': admin_user, 'product': 'Mix Proteico 5 Leguminosas', 'rating': 5, 'comment': 'Mistura muito prática e equilibrada. Recomendo para quem quer variedade sem complicações.'},
    {'user': admin_user, 'product': 'Ervilhas Secas', 'rating': 4, 'comment': 'Ervilhas biológicas de boa qualidade. Ficam ótimas em sopa.'},
]

for review_data in reviews_data:
    product = products[review_data['product']]
    review, created = Review.objects.get_or_create(
        user=review_data['user'],
        product=product,
        defaults={
            'rating': review_data['rating'],
            'comment': review_data['comment'],
        }
    )
    if created:
        print(f"  ✅ Review: {review_data['user'].username} → {product.name}")

# --- Criar artigos do blog ---
blog_data = [
    {
        'title': 'Os 5 Benefícios das Leguminosas para a Saúde',
        'excerpt': 'Descubra porque as leguminosas são consideradas um superalimento e como podem transformar a sua alimentação.',
        'content': """As leguminosas são um dos grupos alimentares mais subvalorizados, mas incrivelmente nutritivos. Aqui estão 5 razões para as incluir na sua dieta diária:

**1. Ricas em Proteína Vegetal**
As leguminosas são uma das melhores fontes de proteína vegetal, contendo entre 20 a 25g de proteína por 100g de produto seco. São essenciais para vegetarianos e veganos, mas benéficas para todos.

**2. Fonte de Fibra Alimentar**
Com 15 a 25g de fibra por 100g, as leguminosas ajudam a regular o trânsito intestinal, a controlar os níveis de colesterol e a manter a sensação de saciedade.

**3. Baixo Índice Glicémico**
Graças à fibra e à sua composição, as leguminosas têm um índice glicémico baixo, o que ajuda a controlar os níveis de açúcar no sangue.

**4. Ricas em Minerais**
Ferro, zinco, magnésio, potássio e folato são apenas alguns dos minerais abundantes nas leguminosas. São particularmente importantes para prevenir anemias.

**5. Sustentáveis e Económicas**
As leguminosas são uma das fontes de proteína mais sustentáveis do planeta, com uma pegada ecológica significativamente menor que a proteína animal. Além disso, são muito acessíveis.""",
        'author': admin_user,
    },
    {
        'title': 'Receita: Hummus Caseiro Perfeito',
        'excerpt': 'Aprenda a fazer hummus cremoso em casa com grão-de-bico nacional em apenas 10 minutos.',
        'content': """O hummus é um dos preparados mais versáteis que pode fazer com grão-de-bico. Esta receita simples dá-lhe um resultado cremoso e cheio de sabor.

**Ingredientes:**
- 400g de grão-de-bico cozido (ou 200g seco, demolhado de véspera)
- 3 colheres de sopa de tahini (pasta de sésamo)
- Sumo de 1 limão
- 2 dentes de alho
- 3 colheres de sopa de azeite extra-virgem
- 1 colher de chá de cominhos
- Sal e pimenta a gosto
- Água da cozedura do grão (q.b.)

**Preparação:**
1. Coza o grão-de-bico até ficar bem macio (cerca de 1h30 se for seco).
2. Guarde a água da cozedura.
3. Num processador, junte o grão, tahini, sumo de limão, alho e cominhos.
4. Triture até obter um creme liso, adicionando água da cozedura aos poucos até atingir a consistência desejada.
5. Tempere com sal e pimenta.
6. Sirva regado com azeite e um polvilhar de pimentão doce.

**Dica:** Para um hummus extra cremoso, retire as peles do grão-de-bico antes de triturar.""",
        'author': admin_user,
    },
    {
        'title': 'Como Demolhar e Cozinhar Leguminosas Corretamente',
        'excerpt': 'Guia completo para tirar o máximo partido das suas leguminosas secas.',
        'content': """Muitas pessoas evitam cozinhar leguminosas secas por acharem complicado. Na verdade, com as técnicas certas, é muito simples!

**Porque Demolhar?**
O demolho reduz os anti-nutrientes (como o ácido fítico), torna as leguminosas mais digestivas e reduz significativamente o tempo de cozedura.

**Tempos de Demolho Recomendados:**
- Feijão: 8 a 12 horas
- Grão-de-bico: 12 a 24 horas
- Lentilhas: Não precisam de demolho!
- Ervilhas secas: 8 a 12 horas
- Favas: 12 a 24 horas

**Tempos de Cozedura (após demolho):**
- Feijão: 45 min a 1h30
- Grão-de-bico: 1h a 1h30
- Lentilhas verdes: 20 a 30 min
- Lentilhas castanhas: 15 a 20 min
- Ervilhas: 30 a 45 min
- Favas: 45 min a 1h

**Dicas Importantes:**
1. Use água fria para o demolho e mude-a pelo menos uma vez.
2. Não adicione sal durante a cozedura — endurece as leguminosas.
3. Uma folha de louro na água de cozedura melhora a digestibilidade.
4. Coza sempre em lume brando para obter uma textura uniforme.""",
        'author': admin_user,
    },
]

for post_data in blog_data:
    post, created = BlogPost.objects.get_or_create(
        title=post_data['title'],
        defaults=post_data
    )
    if created:
        print(f"  ✅ Blog: {post.title}")

print("\n🎉 Base de dados populada com sucesso!")
print(f"   {User.objects.count()} utilizadores")
print(f"   {Category.objects.count()} categorias")
print(f"   {Product.objects.count()} produtos")
print(f"   {Review.objects.count()} avaliações")
print(f"   {BlogPost.objects.count()} artigos de blog")

from products.models import Product

def is_product_request(message):
    keywords = ["رشح", "منتجات", "موبايل", "لابتوب", "اشترى", "افضل"]
    return any(word in message for word in keywords)


def get_products():
    products = Product.objects.all().order_by("-rating")[:5]

    return [
        f"{p.name} - السعر: {p.price} - التقييم: {p.rating}"
        for p in products
    ]


def build_prompt(user_message, products_text):
    return f"""
You are a smart shopping assistant.

User asked:
{user_message}

Available products:
{products_text}

Only recommend from these products.
If nothing matches, say no suitable products.
"""
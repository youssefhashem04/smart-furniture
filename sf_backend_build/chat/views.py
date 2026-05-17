import re

from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ChatSession, ChatMessage
from products.models import Product


# =========================
# DETECT PRODUCT REQUEST
# =========================
def is_product_request(message):

    keywords = [
        "سرير", "كرسي", "كنبة", "دولاب", "مكتب", "طاولة", "ترابيزة",
        "اثاث", "أثاث", "منتج", "منتجات", "اشتري", "رشح", "افضل",
        "bed", "chair", "sofa", "table", "desk", "wardrobe",
        "furniture", "buy", "recommend", "best", "price", "under"
    ]

    message = message.lower()

    return any(word in message for word in keywords)


# =========================
# GET PRODUCTS (CLEAN + SAFE)
# =========================
def get_products(message):

    qs = Product.objects.all()
    msg = message.lower()

    # CATEGORY MAP (expanded)
    category_map = {
    "chairs": [
        "كرسي", "كرسيه", "قعدة", "قاعده", "seat", "chair", "chairs", "armchair", "stool"
    ],

    "desks": [
        "مكتب", "مكتب شغل", "مكتب كمبيوتر", "مكتب دراسة",
        "desk", "desks", "work desk", "computer desk", "office desk"
    ],

    "tables": [
        "طاولة", "ترابيزة", "ترابيزه", "منضدة",
        "table", "tables", "coffee table", "dining table", "side table"
    ],

    "beds": [
        "سرير", "سرير نوم", "سرير خشب",
        "bed", "beds", "mattress", "double bed", "single bed", "king bed"
    ],

    "sofas": [
        "كنبة", "كنبه", "انتريه", "صوفا", "ركنة",
        "sofa", "sofas", "couch", "sectional", "loveseat"
    ],

    "wardrobes": [
        "دولاب", "دولاب ملابس", "خزانة", "خزانه",
        "wardrobe", "wardrobes", "closet", "armoire"
    ],

    "cabinets": [
        "كابينة", "كابينه", "خزانة تخزين", "cabinet", "cabinets", "storage cabinet"
    ],

    "bookshelves": [
        "مكتبة", "مكتبه", "رف كتب",
        "bookshelf", "bookshelves", "shelf", "bookcase"
    ],

    "tv units": [
        "تلفزيون", "ترابيزة تلفزيون", "وحدة تلفزيون",
        "tv", "tv unit", "tv units", "tv stand", "media unit"
    ],

    "dining sets": [
        "سفرة", "سفره", "طقم سفرة", "سفرة كاملة",
        "dining", "dining set", "dining sets", "dining table set"
    ],

    "office furniture": [
        "مكتب", "أثاث مكتب", "اثاث مكتب",
        "office", "office furniture", "workspace", "office setup"
    ],

    "outdoor furniture": [
        "حديقة", "بلكونة", "بلكونه",
        "outdoor", "garden", "balcony", "patio", "outdoor furniture"
    ],
}

    # =========================
    # CATEGORY FILTER
    # =========================
    for cat, words in category_map.items():
        if any(w in msg for w in words):
            qs = qs.filter(category__iexact=cat)
            break

    # =========================
    # PRICE FILTER
    # =========================
    numbers = re.findall(r"\d+", msg)
    if numbers:
        qs = qs.filter(price__lte=int(numbers[0]))

    qs = qs.order_by("-rating")[:5]

    if not qs.exists():
        return []

    # =========================
    # CLEAN RESPONSE (NO rating/category)
    # =========================
    return [
        {
            "id": p.id,
            "name": p.name,
            "price": float(p.price),

            # مهم للـ frontend (فتح المنتج)
            "image": p.image.url if getattr(p, "image", None) else None,
        }
        for p in qs
    ]


# =========================
# CHAT ENDPOINT
# =========================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chat_with_ai(request):

    user = request.user
    message = request.data.get("message")
    session_id = request.data.get("session_id")

    if not message:
        return Response({"error": "message is required"}, status=400)

    # =========================
    # SESSION HANDLING
    # =========================
    if session_id:
        session = get_object_or_404(ChatSession, id=session_id, user=user)
    else:
        session = ChatSession.objects.create(user=user, title=message[:30])

    ChatMessage.objects.create(session=session, role="user", text=message)

    # =========================
    # PRODUCTS LOGIC
    # =========================
    products = []

    if is_product_request(message):
        products = get_products(message)

    # =========================
    # NO PRODUCTS FOUND
    # =========================
    if is_product_request(message) and len(products) == 0:

        reply = (
            "مفيش منتجات مناسبة حالياً"
            if re.search(r'[\u0600-\u06FF]', message)
            else "No matching products found"
        )

        ChatMessage.objects.create(session=session, role="ai", text=reply)

        return Response({
            "reply": reply,
            "products": [],
            "session_id": session.id
        })

    # =========================
    # SUCCESS RESPONSE
    # =========================
    reply = "تم العثور على منتجات مناسبة"

    ChatMessage.objects.create(session=session, role="ai", text=reply)

    return Response({
        "reply": reply,
        "products": products,
        "session_id": session.id
    })


# =========================
# SESSIONS
# =========================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_sessions(request):

    sessions = ChatSession.objects.filter(user=request.user).order_by("-created_at")

    return Response([
        {
            "id": s.id,
            "title": s.title
        }
        for s in sessions
    ])


# =========================
# MESSAGES
# =========================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_messages(request, session_id):

    session = get_object_or_404(ChatSession, id=session_id, user=request.user)

    messages = session.messages.order_by("created_at")

    return Response([
        {
            "role": m.role,
            "text": m.text
        }
        for m in messages
    ])


# =========================
# CREATE SESSION
# =========================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_session(request):

    session = ChatSession.objects.create(
        user=request.user,
        title="New Chat"
    )

    return Response({
        "id": session.id,
        "title": session.title
    })


# =========================
# DELETE SESSION
# =========================
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_session(request, session_id):

    ChatSession.objects.filter(
        id=session_id,
        user=request.user
    ).delete()

    return Response({"message": "deleted"})
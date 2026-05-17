# Smart Furniture Backend (Django + DRF)

## البرامج المطلوبة
- Python 3.10+ 
- VS Code
- إضافة Python داخل VS Code
- Thunder Client أو Postman لتجربة الـ API

## تشغيل المشروع
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## أهم الـ APIs
- `POST /api/users/register/`
- `POST /api/users/login/`
- `GET /api/users/profile/`
- `GET /api/products/`
- `POST /api/products/`
- `POST /api/orders/create/`
- `GET /api/orders/my-orders/`
- `GET /api/orders/all/`

## ملاحظات
- المنتجات اللي `has_custom_size = true` لازم تستقبل `custom_width/custom_depth/custom_height`.
- المنتجات العادية لازم تستقبل `size` فقط.
- إضافة المنتجات متاحة فقط لـ seller أو admin.

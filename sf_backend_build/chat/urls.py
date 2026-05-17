from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat_with_ai, name='chat-with-ai'),
    path('sessions/', views.get_sessions, name='chat-sessions'),
    path('sessions/create/', views.create_session, name='chat-create-session'),
    path('sessions/<int:session_id>/messages/', views.get_messages, name='chat-messages'),
    path('sessions/<int:session_id>/delete/', views.delete_session, name='chat-delete-session'),
]
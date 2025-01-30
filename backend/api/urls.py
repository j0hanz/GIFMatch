from django.urls import path

from .views import (
    GameListCreateView,
    LeaderboardListView,
    ProfileDetailView,
    ProfileListCreateView,
)

urlpatterns = [
    path('profiles/', ProfileListCreateView.as_view()),
    path('profiles/<int:pk>/', ProfileDetailView.as_view()),
    path('games/', GameListCreateView.as_view()),
    path('leaderboard/', LeaderboardListView.as_view()),
]

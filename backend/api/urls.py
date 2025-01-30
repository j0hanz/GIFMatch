from django.urls import path

from .views import (
    GameDetailView,
    GameListCreateView,
    LeaderboardListView,
    ProfileDetailView,
    ProfileListCreateView,
)

urlpatterns = [
    path(
        'profiles/',
        ProfileListCreateView.as_view(),
        name='profile-list-create',
    ),
    path(
        'profiles/<int:pk>/',
        ProfileDetailView.as_view(),
        name='profile-detail',
    ),
    path('games/', GameListCreateView.as_view(), name='game-list-create'),
    path('games/<int:pk>/', GameDetailView.as_view(), name='game-detail'),
    path(
        'leaderboard/', LeaderboardListView.as_view(), name='leaderboard-list'
    ),
]

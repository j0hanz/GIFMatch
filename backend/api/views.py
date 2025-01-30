from memorix.permissions import IsOwnerOrReadOnly
from rest_framework import generics

from .models import Game, Leaderboard, Profile
from .serializers import (
    GameSerializer,
    LeaderboardSerializer,
    ProfileSerializer,
)


class ProfileListCreateView(generics.ListAPIView):
    """View to list and create profiles."""

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View to retrieve, update, or delete a profile."""

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]


class GameListCreateView(generics.ListAPIView):
    """View to list and create games."""

    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GameDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View to retrieve, update, or delete a game."""

    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [IsOwnerOrReadOnly]


class LeaderboardListView(generics.ListAPIView):
    """View to list leaderboard entries."""

    queryset = Leaderboard.objects.all().order_by('best_moves', 'best_time')
    serializer_class = LeaderboardSerializer

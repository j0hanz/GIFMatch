from memorix.permissions import IsOwnerOrReadOnly
from rest_framework import generics

from .models import Game, Leaderboard, Profile
from .serializers import (
    GameSerializer,
    LeaderboardSerializer,
    ProfileSerializer,
)


class ProfileListCreateView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]


class GameListCreateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LeaderboardListView(generics.ListAPIView):
    queryset = Leaderboard.objects.all().order_by('best_moves', 'best_time')
    serializer_class = LeaderboardSerializer
    permission_classes = [IsOwnerOrReadOnly]

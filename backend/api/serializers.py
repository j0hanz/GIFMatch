from rest_framework import serializers

from .models import Game, Leaderboard, Profile


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for the Profile model."""

    profile_picture_url = serializers.ReadOnlyField(
        source='profile_picture.url'
    )
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Profile
        fields = [
            'id',
            'owner',
            'owner_username',
            'profile_picture',
            'profile_picture_url',
            'created_at',
            'updated_at',
        ]


class GameSerializer(serializers.ModelSerializer):
    """Serializer for the Game model."""

    class Meta:
        model = Game
        fields = ['id', 'user', 'moves', 'time_taken', 'date_played']


class LeaderboardSerializer(serializers.ModelSerializer):
    """Serializer for the Leaderboard model."""

    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'best_moves', 'best_time']

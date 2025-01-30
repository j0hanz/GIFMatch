from typing import Any

from cloudinary.models import CloudinaryField
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    """Model representing a user profile."""

    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = CloudinaryField(
        'image',
        default='nobody_nrbk5n',
        blank=True,
        null=True,
        help_text='Upload a profile picture',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"{self.owner.username}'s profile"


@receiver(post_save, sender=User)
def create_or_update_profile(
    sender: Any, instance: User, created: bool, **kwargs: dict
) -> None:
    """Create or update a profile when a user is saved."""
    if created:
        Profile.objects.create(owner=instance)
    elif hasattr(instance, 'profile'):
        instance.profile.save()
    else:
        Profile.objects.create(owner=instance)


class Game(models.Model):
    """Model representing a game."""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    moves = models.IntegerField()
    time_taken = models.IntegerField()
    date_played = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.date_played}'


class Leaderboard(models.Model):
    """Model representing a leaderboard entry."""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    best_moves = models.IntegerField()
    best_time = models.IntegerField()

    def __str__(self):
        return f'{self.user.username} - Moves: {self.best_moves}, Time: {self.best_time}'

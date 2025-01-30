from django.contrib import admin

from .models import Game, Leaderboard, Profile

admin.site.register(Game)
admin.site.register(Leaderboard)
admin.site.register(Profile)

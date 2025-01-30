from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import APIView


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allows read-only access unless owner is requesting write."""

    def has_object_permission(
        self, request: Request, view: APIView, obj: object
    ) -> bool:
        return (
            request.method in permissions.SAFE_METHODS
            or getattr(obj, 'owner', None) == request.user
        )

from django.urls import path, include

urlpatterns = [
    path("v1/", include("app.core.api_v1.urls")),
]

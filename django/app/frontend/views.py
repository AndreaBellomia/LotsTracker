from typing import Any
from django.shortcuts import render
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin



class MainView(LoginRequiredMixin,TemplateView):
    
    template_name = "frontend/index.html"
    
    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context["DEBUG"] = settings.DEBUG
        return context

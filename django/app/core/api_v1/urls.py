from django.urls import path, include


from app.core.api_v1.views import CustomerRegistryApiView, CustomerRegistryDetailApiView, SupplierRegistryApiView, DocumentCustomerApiView


urlpatterns = [
    path("suppliers", SupplierRegistryApiView.as_view(), name="supplier-registry"),
    path("customers", CustomerRegistryApiView.as_view(), name="customer-registry"),
    path("customer/detail/<int:pk>", CustomerRegistryDetailApiView.as_view(), name="customer-detail"),
    path("documents/customer", DocumentCustomerApiView.as_view(), name="documents-customer"),
]
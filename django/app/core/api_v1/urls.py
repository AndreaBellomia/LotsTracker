from django.urls import path, include


from app.core.api_v1.views import CustomerRegistryApiView, CustomerRegistryDetailApiView, SupplierRegistryApiView, DocumentCustomerApiView, DocumentCustomerDetailApiView, WarehouseItemsApiView, WarehouseItemsDetailApiView


urlpatterns = [
    path("suppliers", SupplierRegistryApiView.as_view(), name="supplier-registry"),
    path("customers", CustomerRegistryApiView.as_view(), name="customer-registry"),
    path("customer/detail/<int:pk>", CustomerRegistryDetailApiView.as_view(), name="customer-detail"),
    path("documents/customer", DocumentCustomerApiView.as_view(), name="documents-customer"),
    path("document/detail/<int:pk>", DocumentCustomerDetailApiView.as_view(), name="document-detail"),
    path("warehouse/items", WarehouseItemsApiView.as_view(), name="warehouse-items"),
    path("warehouse/items/detail/<int:pk>", WarehouseItemsDetailApiView.as_view(), name="warehouse-items-detail"),
]
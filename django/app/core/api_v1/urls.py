from django.urls import path, include


from app.core.api_v1.views import (
    CustomerRegistryApiView,
    CustomerRegistryDetailApiView,
    SupplierRegistryApiView,
    SupplierRegistryDetailApiView,
    DocumentCustomerApiView,
    DocumentCustomerDetailApiView,
    WarehouseItemsApiView,
    WarehouseItemsDetailApiView,
    WarehouseItemsRegistryApiView,
    WarehouseItemsRegistryDetailApiView,
)


urlpatterns = [
    # Suppliers
    path("suppliers", SupplierRegistryApiView.as_view(), name="supplier-registry"),
    path(
        "suppliers/detail/<int:pk>",
        SupplierRegistryDetailApiView.as_view(),
        name="supplier-detail",
    ),
    
    # Customers
    path("customers", CustomerRegistryApiView.as_view(), name="customer-registry"),
    path(
        "customers/detail/<int:pk>",
        CustomerRegistryDetailApiView.as_view(),
        name="customer-detail",
    ),
    path(
        "customers/documents",
        DocumentCustomerApiView.as_view(),
        name="documents-customer",
    ),
    path(
        "customers/documents/detail/<int:pk>",
        DocumentCustomerDetailApiView.as_view(),
        name="document-detail",
    ),
    
    # Warehouse
    path("warehouse/items", WarehouseItemsApiView.as_view(), name="warehouse-items"),
    path(
        "warehouse/items/detail/<int:pk>",
        WarehouseItemsDetailApiView.as_view(),
        name="warehouse-items-detail",
    ),
    path("warehouse/registry", WarehouseItemsRegistryApiView.as_view(), name="warehouse-registry"),
    path(
        "warehouse/registry/detail/<int:pk>",
        WarehouseItemsRegistryDetailApiView.as_view(),
        name="warehouse-registry-detail",
    ),
]

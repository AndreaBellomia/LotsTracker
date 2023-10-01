from django.urls import path, include


from app.api.v1.views import (
    CustomerRegistryApiView,
    CustomerRegistryDetailApiView,
    SupplierRegistryApiView,
    SupplierRegistryDetailApiView,
    DocumentCustomerListApiView,
    DocumentCustomerCreateApiView,
    DocumentCustomerDetailApiView,
    WarehouseItemsApiView,
    WarehouseItemsDetailApiView,
    WarehouseItemsRegistryApiView,
    WarehouseItemsRegistryDetailApiView,
    DocumentFromSupplierCreateApiView,
    DocumentFromSupplierListApiView,
    DocumentFromSupplierDetailApiView,
    DocumentToSupplierCreateApiView,
    DocumentToSupplierListApiView,
    DocumentToSupplierDetailApiView,
)


urlpatterns = [
    # Suppliers
    path("suppliers", SupplierRegistryApiView.as_view(), name="supplier-registry"),
    path(
        "suppliers/detail/<int:pk>",
        SupplierRegistryDetailApiView.as_view(),
        name="suppliers-detail",
    ),
    path(
        "suppliers/documents/from",
        DocumentFromSupplierListApiView.as_view(),
        name="suppliers-documents-from",
    ),
    path(
        "suppliers/documents/from/create",
        DocumentFromSupplierCreateApiView.as_view(),
        name="suppliers-documents-from-create",
    ),
    path(
        "suppliers/documents/from/detail/<int:pk>",
        DocumentFromSupplierDetailApiView.as_view(),
        name="suppliers-documents-from-detail",
    ),
    path(
        "suppliers/documents/to",
        DocumentToSupplierListApiView.as_view(),
        name="suppliers-documents-to",
    ),
    path(
        "suppliers/documents/to/create",
        DocumentToSupplierCreateApiView.as_view(),
        name="suppliers-documents-to-create",
    ),
    path(
        "suppliers/documents/to/detail/<int:pk>",
        DocumentToSupplierDetailApiView.as_view(),
        name="suppliers-documents-to-detail",
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
        DocumentCustomerListApiView.as_view(),
        name="customers-documents",
    ),
    path(
        "customers/documents/create",
        DocumentCustomerCreateApiView.as_view(),
        name="customers-documents-create",
    ),
    path(
        "customers/documents/detail/<int:pk>",
        DocumentCustomerDetailApiView.as_view(),
        name="customers-documents-detail",
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

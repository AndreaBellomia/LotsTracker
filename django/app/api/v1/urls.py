from django.urls import path, include

from app.api.v1 import views


urlpatterns = [
    # Suppliers
    path(
        "suppliers", views.SupplierRegistryApiView.as_view(), name="supplier-registry"
    ),
    path(
        "suppliers/detail/<int:pk>",
        views.SupplierRegistryDetailApiView.as_view(),
        name="suppliers-detail",
    ),
    path(
        "suppliers/documents/from",
        views.DocumentFromSupplierListApiView.as_view(),
        name="suppliers-documents-from",
    ),
    path(
        "suppliers/documents/from/create",
        views.DocumentFromSupplierCreateApiView.as_view(),
        name="suppliers-documents-from-create",
    ),
    path(
        "suppliers/documents/from/detail/<int:pk>",
        views.DocumentFromSupplierDetailApiView.as_view(),
        name="suppliers-documents-from-detail",
    ),
    path(
        "suppliers/documents/to",
        views.DocumentToSupplierListApiView.as_view(),
        name="suppliers-documents-to",
    ),
    path(
        "suppliers/documents/to/create",
        views.DocumentToSupplierCreateApiView.as_view(),
        name="suppliers-documents-to-create",
    ),
    path(
        "suppliers/documents/to/detail/<int:pk>",
        views.DocumentToSupplierDetailApiView.as_view(),
        name="suppliers-documents-to-detail",
    ),
    # Customers
    path(
        "customers", views.CustomerRegistryApiView.as_view(), name="customer-registry"
    ),
    path(
        "customers/detail/<int:pk>",
        views.CustomerRegistryDetailApiView.as_view(),
        name="customer-detail",
    ),
    path(
        "customers/documents",
        views.DocumentCustomerListApiView.as_view(),
        name="customers-documents",
    ),
    path(
        "customers/documents/create",
        views.DocumentCustomerCreateApiView.as_view(),
        name="customers-documents-create",
    ),
    path(
        "customers/documents/detail/<int:pk>",
        views.DocumentCustomerDetailApiView.as_view(),
        name="customers-documents-detail",
    ),
    # Warehouse
    path(
        "warehouse/items", views.WarehouseItemsApiView.as_view(), name="warehouse-items"
    ),
    path(
        "warehouse/items/<str:status>",
        views.WarehouseItemsStatusApiView.as_view(),
        name="warehouse-items-status",
    ),
    path(
        "warehouse/items/detail/<int:pk>",
        views.WarehouseItemsDetailApiView.as_view(),
        name="warehouse-items-detail",
    ),
    path(
        "warehouse/registry",
        views.WarehouseItemsRegistryApiView.as_view(),
        name="warehouse-registry",
    ),
    path(
        "warehouse/registry/detail/<int:pk>",
        views.WarehouseItemsRegistryDetailApiView.as_view(),
        name="warehouse-registry-detail",
    ),
    path(
        "customers/register/entry/<int:counterpart>",
        views.WarehouseItemsCustomerEntryApiView.as_view(),
        name="customers-registry-entry",
    ),
    path(
        "warehouse/items/entry/<int:warehouse_item>",
        views.WarehouseItemsEntryApiView.as_view(),
        name="warehouse-items-registry-entry",
    ),
    path(
        "customers/warehouse/list/<int:pk>",
        views.CustomerWarehouseItemsApiView.as_view(),
        name="customers-warehouse-list",
    ),
    path(
        "warehouse/items/list/batch/<str:batch_code>",
        views.WarehouseItemsBatchCodeApiView.as_view(),
        name="customers-warehouse-list-batch",
    ),
]

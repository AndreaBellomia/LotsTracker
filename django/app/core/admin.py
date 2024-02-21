from django.contrib import admin

from app.core.models import (
    SupplierRegistry,
    CustomerRegistry,
    DocumentFromSupplier,
    DocumentToSupplier,
    DocumentCustomer,
    WarehouseItemsRegistry,
    WarehouseItems,
)


admin.site.register(WarehouseItemsRegistry)


@admin.register(WarehouseItems)
class WarehouseItemsAdmin(admin.ModelAdmin):
    list_display = ["batch_code", "display_item_type", "status"]
    search_fields = ["batch_code", "status"]
    list_filter = ["status", "item_type"]
    raw_id_fields = [
        "document_from_supplier",
        "document_to_supplier",
        "document_customer",
    ]
    readonly_fields = ('status',)

    def display_item_type(self, obj):
        try:
            return obj.item_type.description
        except:
            return ""


@admin.register(DocumentCustomer)
class DocumentCustomerAdmin(admin.ModelAdmin):
    list_display = ["display_customer_name", "date", "number", "year"]
    search_fields = ["display_customer_name", "date", "number"]
    list_filter = ["year"]
    raw_id_fields = [
        "customer",
    ]

    def display_customer_name(self, obj):
        try:
            return obj.customer.company_name
        except:
            return ""


@admin.register(DocumentFromSupplier)
class DocumentFromSupplierAdmin(admin.ModelAdmin):
    list_display = ["display_supplier_name", "date", "number", "year"]
    search_fields = ["display_supplier_name", "date", "number"]
    list_filter = ["year"]
    raw_id_fields = [
        "supplier",
    ]

    def display_supplier_name(self, obj):
        try:
            return obj.supplier.company_name
        except:
            return ""


@admin.register(DocumentToSupplier)
class DocumentToSupplierAdmin(admin.ModelAdmin):
    list_display = ["display_supplier_name", "date", "number", "year"]
    search_fields = ["display_supplier_name", "date", "number"]
    raw_id_fields = [
        "supplier",
    ]

    def display_supplier_name(self, obj):
        try:
            return obj.supplier.company_name
        except:
            return ""


@admin.register(CustomerRegistry)
class CustomerRegistryAdmin(admin.ModelAdmin):
    list_display = ["id", "company_name", "external_code", "vat_number"]
    search_fields = ["company_name", "external_code", "vat_number"]


@admin.register(SupplierRegistry)
class SupplierRegistryAdmin(admin.ModelAdmin):
    list_display = ["id", "company_name", "external_code", "vat_number"]
    search_fields = ["company_name", "external_code", "vat_number"]

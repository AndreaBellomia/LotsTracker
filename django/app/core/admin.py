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


admin.site.register(SupplierRegistry)
admin.site.register(CustomerRegistry)
admin.site.register(DocumentFromSupplier)
admin.site.register(DocumentToSupplier)
admin.site.register(DocumentCustomer)
admin.site.register(WarehouseItemsRegistry)
admin.site.register(WarehouseItems)

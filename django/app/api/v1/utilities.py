from app.core.models import DocumentCustomer, DocumentToSupplier, WarehouseItems


def save_document_bodies(bodies: list[WarehouseItems], document_instance: DocumentCustomer | DocumentToSupplier):
    errors = []
    for item in bodies:
        instance: WarehouseItems = item.pop("instance")
        

        if instance and instance.document_customer and instance.document_customer.id != document_instance.id:
            errors.append(
                {
                    "id": instance.id,
                    "message": "Item already related to another document customer",
                }
            )

        elif instance:
            instance.document_customer = document_instance
            instance.empty_date = item.get("empty_date", None)
            instance.custom_status = item.get("custom_status", None)
            instance.save()
        else:
            errors.append(
                {
                    "id": instance.id,
                    "message": "Item id not found in database",
                }
            )
            
    return errors
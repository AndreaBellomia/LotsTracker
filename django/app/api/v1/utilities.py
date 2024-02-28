from app.core.models import DocumentCustomer, DocumentToSupplier, WarehouseItems


def save_document_bodies(bodies: list[WarehouseItems], document_instance, document_type):
    errors = []
    for item in bodies:
        instance: WarehouseItems = item.pop("instance")
        
        related_document = getattr(instance, document_type)
        if instance and related_document and related_document.id != document_instance.id:
            errors.append(
                {
                    "id": instance.id,
                    "message": "Item already related to another document customer",
                }
            )

        elif instance:
            setattr(instance, document_type, document_instance)
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
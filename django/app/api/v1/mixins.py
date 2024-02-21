from django.db import transaction
from rest_framework import serializers
from app.core.models import (
    WarehouseItems,
)


class WarehouseItemsDocumentSerializerMixin(serializers.ModelSerializer):
    item_type_description = serializers.StringRelatedField(
        source="item_type.description", default=None
    )
    item_type_code = serializers.StringRelatedField(
        source="item_type.internal_code", default=None
    )

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)
        id = data.get("id", None)

        try:
            validated_data["instance"] = WarehouseItems.objects.filter(pk=id).first()
        except:
            validated_data["instance"] = None

        return validated_data


class DocumentSupplierSerializerMixin(serializers.ModelSerializer):
    document_details = serializers.IntegerField(read_only=True)

    supplier = serializers.StringRelatedField(
        source="customer.company_name", read_only=True
    )
    supplier_code = serializers.StringRelatedField(
        source="customer.external_code", read_only=True
    )

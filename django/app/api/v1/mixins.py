from django.db import transaction
from rest_framework import serializers
from app.core.models import (
    WarehouseItems,
)


class DocumentSupplierSerializerMixin(serializers.ModelSerializer):
    document_details = serializers.IntegerField(read_only=True)

    supplier = serializers.StringRelatedField(
        source="customer.company_name", read_only=True
    )
    supplier_code = serializers.StringRelatedField(
        source="customer.external_code", read_only=True
    )

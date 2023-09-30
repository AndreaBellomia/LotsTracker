from rest_framework import serializers
from django.db import transaction

from app.core.models import (
    CustomerRegistry,
    DocumentCustomer,
    SupplierRegistry,
    WarehouseItems,
)


class SupplierRegistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierRegistry
        fields = "__all__"


class CustomerRegistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerRegistry
        fields = "__all__"


class WarehouseItemsDocumentCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarehouseItems
        fields = "__all__"


class DocumentCustomerSerializer(serializers.ModelSerializer):
    detail_status = serializers.StringRelatedField(source="get_status")
    detail = WarehouseItemsDocumentCustomerSerializer(
        many=True, source="warehouse_items", required=True, write_only=True
    )

    customer = serializers.StringRelatedField(source="customer.company_name")
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomerRegistry.objects.all(), source="customer", write_only=True
    )

    def create(self, validated_data):
        _warehouse_items = validated_data.pop("warehouse_items")

        with transaction.atomic():
            document_customer = DocumentCustomer.objects.create(**validated_data)
            for item_data in _warehouse_items:
                WarehouseItems.objects.create(
                    document_customer=document_customer, **item_data
                )

        return document_customer

    class Meta:
        model = DocumentCustomer
        exclude = ["id", "created_at", "updated_at"]

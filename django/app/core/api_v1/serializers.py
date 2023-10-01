from rest_framework import serializers
from django.db import transaction

from app.core.models import (
    CustomerRegistry,
    DocumentCustomer,
    SupplierRegistry,
    WarehouseItems,
    WarehouseItemsRegistry,
)


class SupplierRegistrySerializer(serializers.ModelSerializer):
    detail_url = serializers.HyperlinkedIdentityField(
        view_name="supplier-detail", source="id"
    )
    class Meta:
        model = SupplierRegistry
        fields = "__all__"


class CustomerRegistrySerializer(serializers.ModelSerializer):
    detail_url = serializers.HyperlinkedIdentityField(
        view_name="customer-detail", source="id"
    )
    class Meta:
        model = CustomerRegistry
        fields = "__all__"


class WarehouseItemsDocumentCustomerSerializer(serializers.ModelSerializer):
    item_type_description = serializers.StringRelatedField(
        source="item_type.description", default=None
    )
    item_type_code = serializers.StringRelatedField(
        source="item_type.internal_code", default=None
    )

    class Meta:
        model = WarehouseItems
        # fields = "__all__"
        exclude = [
            "created_at",
            "updated_at",
            "document_from_supplier",
            "document_to_supplier",
            "document_customer",
        ]
        read_only_fields = [
            "item_type_description",
            "item_type_code",
            "status",
            "batch_code",
            "item_type",
        ]

        extra_kwargs = {
            "custom_status": {"write_only": True},
        }

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)
        id = data.get("id", None)
        if id:
            try:
                validated_data["instance"] = WarehouseItems.objects.filter(
                    pk=id
                ).first()
            except:
                pass

        return validated_data


class DocumentCustomerSerializer(serializers.ModelSerializer):
    status = serializers.StringRelatedField(source="document_status", read_only=True)
    body = WarehouseItemsDocumentCustomerSerializer(many=True, source="warehouse_items")

    customer = serializers.StringRelatedField(source="customer.company_name", read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomerRegistry.objects.all(), source="customer", write_only=True
    )

    detail_url = serializers.HyperlinkedIdentityField(
        view_name="document-detail", source="id"
    )

    def create(self, validated_data):
        warehouse_items = validated_data.pop("warehouse_items")

        with transaction.atomic():
            instance = super().create(validated_data)
            error_messages = []

            for item_data in warehouse_items:
                item_instance: WarehouseItems = item_data.get("instance")

                if not item_instance:
                    error_messages.append(
                        {
                            "id": item_instance.id,
                            "message": "Item id not found in database",
                        }
                    )

                if item_instance and item_instance.document_customer != None:
                    error_messages.append(
                        {
                            "id": item_instance.id,
                            "message": "Item already related to another document customer",
                        }
                    )

                if item_instance and len(error_messages) == 0:
                    item_instance.document_customer = instance
                    item_instance.empty_date = item_data.get("empty_date", None)
                    item_instance.custom_status = item_data.get("custom_status", None)
                    item_instance.save()

            if error_messages:
                raise serializers.ValidationError({"body": error_messages})

        return instance

    def update(self, instance: DocumentCustomer, validated_data):
        warehouse_items = validated_data.pop("warehouse_items")
        error_messages = []

        with transaction.atomic():
            instance.warehouse_items.clear()

            for item_data in warehouse_items:
                item_instance: WarehouseItems = item_data.get("instance")

                if not item_instance:
                    error_messages.append(
                        {
                            "id": item_instance.id,
                            "message": "Item id not found in database",
                        }
                    )

                if (
                    item_instance
                    and item_instance.document_customer
                    and item_instance.document_customer.id != instance.id
                ):
                    error_messages.append(
                        {
                            "id": item_instance.id,
                            "message": "Item already related to another document customer",
                        }
                    )

                if item_instance and len(error_messages) == 0:
                    item_instance.document_customer = instance
                    item_instance.empty_date = item_data.get("empty_date", None)
                    item_instance.custom_status = item_data.get("custom_status", None)
                    item_instance.save()

            if error_messages:
                raise serializers.ValidationError({"body": error_messages})

        return super().update(instance, validated_data)

    class Meta:
        model = DocumentCustomer
        exclude = ["created_at", "updated_at"]


class WarehouseItemsSerializer(serializers.ModelSerializer):
    item_type_description = serializers.CharField(read_only=True)
    item_type_code = serializers.CharField(read_only=True)
    customer_company_name = serializers.CharField(read_only=True)
    customer_company_code = serializers.CharField(read_only=True)
    supplier_from_company_name = serializers.CharField(read_only=True)
    supplier_from_company_code = serializers.CharField(read_only=True)
    document_to_supplier_name = serializers.CharField(read_only=True)
    document_to_supplier_code = serializers.CharField(read_only=True)

    detail_url = serializers.HyperlinkedIdentityField(
        view_name="warehouse-items-detail", source="id"
    )

    class Meta:
        model = WarehouseItems
        exclude = [
            "created_at",
            "updated_at",
        ]

        extra_kwargs = {
            "item_type": {"write_only": True},
            "document_customer": {"write_only": True},
            "document_from_supplier": {"write_only": True},
            "document_to_supplier": {"write_only": True},
        }

class WarehouseItemsRegistrySerializer(serializers.ModelSerializer):
    
    detail_url = serializers.HyperlinkedIdentityField(
        view_name="warehouse-registry-detail", source="id"
    )
    
    class Meta:
        model = WarehouseItemsRegistry
        exclude = [
            "created_at",
            "updated_at",
        ]
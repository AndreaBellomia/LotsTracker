import logging
from django.db import transaction, IntegrityError
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator


from app.api.v1.mixins import (
    DocumentSupplierSerializerMixin,
)
from app.core.models import (
    CustomerRegistry,
    DocumentCustomer,
    DocumentFromSupplier,
    SupplierRegistry,
    WarehouseItems,
    WarehouseItemsRegistry,
    DocumentToSupplier,
)
from app.api.v1.utilities import save_document_bodies

log = logging.getLogger(__name__)

class WarehouseItemsRegistrySerializer(serializers.ModelSerializer):
    # detail_url = serializers.HyperlinkedIdentityField(
    #     view_name="warehouse-registry-detail", source="id"
    # )

    available_count = serializers.ReadOnlyField()

    class Meta:
        model = WarehouseItemsRegistry
        exclude = [
            "created_at",
            "updated_at",
        ]


class WarehouseItemsDocumentSerializerMixin(serializers.ModelSerializer):
    
    item_type = WarehouseItemsRegistrySerializer(read_only=True)

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)
        id = data.get("id", None)

        try:
            validated_data["instance"] = WarehouseItems.objects.filter(pk=id).first()
        except:
            validated_data["instance"] = None

        return validated_data
    
    class Meta:
        model = WarehouseItems
        exclude = [
            "created_at",
            "updated_at",
            "document_from_supplier",
            "document_to_supplier",
            "document_customer",
        ]

#####
# Customer
#####
class CustomerRegistrySerializer(serializers.ModelSerializer):
    detail_url = serializers.HyperlinkedIdentityField(
        view_name="customer-detail", source="id"
    )

    class Meta:
        model = CustomerRegistry
        fields = "__all__"
        validators = [
            UniqueTogetherValidator(
                queryset=CustomerRegistry.objects.all(),
                fields=["company_name", "vat_number"],
                message="Il Nome della controparte e la Piva esistono già",
            )
        ]


class DocumentCustomerSerializer(serializers.ModelSerializer):
    status = serializers.StringRelatedField(source="document_status", read_only=True)
    document_details = serializers.IntegerField(read_only=True)

    customer = serializers.StringRelatedField(
        source="customer.company_name", read_only=True
    )
    customer_code = serializers.StringRelatedField(
        source="customer.external_code", read_only=True
    )

    detail_url = serializers.HyperlinkedIdentityField(
        view_name="customers-documents-detail", source="id"
    )

    def create(self, validated_data):
        try:
            instance = super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError(
                {
                    "detail": f'Document number "{validated_data["number"]}" duplicated for year {validated_data["date"]}'
                }
            )
        except Exception as e:
            raise serializers.ValidationError({"detail": "Error creating document."})
        return instance

    class Meta:
        model = DocumentCustomer
        exclude = ["created_at", "updated_at"]


class DocumentCustomerDetailSerializer(serializers.ModelSerializer):

    class WarehouseItemsDocumentCustomerSerializer(
        WarehouseItemsDocumentSerializerMixin
    ):
        class Meta(WarehouseItemsDocumentSerializerMixin.Meta):
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

    status = serializers.StringRelatedField(source="document_status", read_only=True)
    body = WarehouseItemsDocumentCustomerSerializer(many=True, source="warehouse_items")

    customer = CustomerRegistrySerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomerRegistry.objects.all(), source="customer", write_only=False
    )

    def create(self, validated_data):
        body_items = validated_data.pop("warehouse_items")

        with transaction.atomic():

            if self.Meta.model.objects.filter(
                year=validated_data["date"].year, number=validated_data["number"]
            ).exists():
                raise serializers.ValidationError(
                    {
                        "date": "Document already exist for this yar",
                        "number": "Document already exist for this yar",
                    }
                )

            try:
                instance: self.Meta.model = super().create(validated_data)
            except Exception as e:
                log.exception(
                    "Unexpected exception during save document instance: %s", e
                )

                raise serializers.ValidationError(
                    {"detail": "Error creating document."}
                )

            if len(body_items) == 0:
                raise serializers.ValidationError({"detail": "Body can't be empty"})
            
            error_messages = save_document_bodies(body_items, instance)
            if len(error_messages) != 0:
                raise serializers.ValidationError({"body": error_messages})

        return instance

    def update(self, instance: DocumentCustomer, validated_data):
        body_items = validated_data.pop("warehouse_items")

        with transaction.atomic():
            instance.warehouse_items.all().update(document_customer=None)
            
            # instance.warehouse_items.clear()
            
            if (
                self.Meta.model.objects.exclude(id=instance.id)
                .filter(
                    year=validated_data["date"].year,
                    number=validated_data["number"],
                )
                .exists()
            ):
                raise serializers.ValidationError(
                    {
                        "date": "Document already exist for this yar",
                        "number": "Document already exist for this yar",
                    }
                )

            if len(body_items) == 0:
                raise serializers.ValidationError({"detail": "Body can't be empty"})
            
            error_messages = save_document_bodies(body_items, instance)
            if len(error_messages) != 0:
                raise serializers.ValidationError({"body": error_messages})
        return instance

    class Meta:
        model = DocumentCustomer
        exclude = ["created_at", "updated_at"]


####
# Supplier
####


class SupplierRegistrySerializer(serializers.ModelSerializer):
    detail_url = serializers.HyperlinkedIdentityField(
        view_name="suppliers-detail", source="id"
    )

    class Meta:
        model = SupplierRegistry
        fields = "__all__"


class DocumentFromSupplierSerializer(DocumentSupplierSerializerMixin):
    detail_url = serializers.HyperlinkedIdentityField(
        view_name="suppliers-documents-from-detail", source="id"
    )

    class Meta:
        model = DocumentFromSupplier
        exclude = ["created_at", "updated_at"]


class DocumentToSupplierSerializer(DocumentSupplierSerializerMixin):
    detail_url = serializers.HyperlinkedIdentityField(
        view_name="suppliers-documents-to-detail", source="id"
    )

    class Meta:
        model = DocumentToSupplier
        exclude = ["created_at", "updated_at"]


class WarehouseItemsDocumentSupplierFromSerializer(
    WarehouseItemsDocumentSerializerMixin
):
    class Meta:
        read_only_fields = [
            "item_type_description",
            "item_type_code",
            "status",
        ]

        extra_kwargs = {
            "custom_status": {"write_only": True},
        }


class DocumentFromSupplierDetailSerializer(serializers.ModelSerializer):
    body = WarehouseItemsDocumentSupplierFromSerializer(
        many=True, source="warehouse_items"
    )

    supplier = serializers.StringRelatedField(
        source="supplier.company_name", read_only=True
    )
    supplier_id = serializers.PrimaryKeyRelatedField(
        queryset=SupplierRegistry.objects.all(), source="supplier", write_only=True
    )

    def create(self, validated_data):
        body_items = validated_data.pop("warehouse_items")
        error_messages = []

        with transaction.atomic():
            try:
                instance = super().create(validated_data)
            except Exception as e:
                raise serializers.ValidationError(
                    {"Detail": "Error creating document."}
                )

            for b_item in body_items:
                item_instance: WarehouseItems = b_item.pop("instance")

                if item_instance and item_instance.document_from_supplier != None:
                    error_messages.append(
                        {
                            "id": item_instance.id,
                            "message": "Item already related to another document customer",
                        }
                    )

                elif item_instance:
                    item_instance.document_from_supplier = instance
                    item_instance.empty_date = b_item.get("empty_date", None)
                    item_instance.save()
                else:
                    try:
                        WarehouseItems.objects.create(
                            **b_item, document_from_supplier=instance
                        )
                    except:
                        error_messages.append(
                            {
                                "batch_code": item_instance.id,
                                "message": "Error creating item",
                            }
                        )
            if error_messages:
                raise serializers.ValidationError({"body": error_messages})
        return instance

    def update(self, instance: DocumentFromSupplier, validated_data):
        body_items = validated_data.pop("warehouse_items")
        error_messages = []

        with transaction.atomic():
            instance.warehouse_items.clear()

            for b_item in body_items:
                item_instance: WarehouseItems = b_item.pop("instance")

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

                elif item_instance:
                    item_instance.document_from_supplier = instance
                    item_instance.batch_code = b_item.get("batch_code", None)
                    item_instance.item_type = b_item.get("item_type", None)
                    item_instance.save()
                else:
                    try:
                        WarehouseItems.objects.create(
                            **b_item, document_from_supplier=instance
                        )
                    except Exception as e:
                        print(e)
                        error_messages.append(
                            {
                                "batch_code": b_item.get("batch_code", None),
                                "message": "Error creating item",
                            }
                        )

            if error_messages:
                raise serializers.ValidationError({"body": error_messages})

        return super().update(instance, validated_data)

    class Meta:
        model = DocumentFromSupplier
        exclude = ["created_at", "updated_at"]


class WarehouseItemsDocumentSupplierToSerializer(WarehouseItemsDocumentSerializerMixin):
    class Meta:
        read_only_fields = [
            "item_type_description",
            "item_type_code",
            "status",
            "empty_date",
            "batch_code",
            "item_type",
            "custom_status",
        ]


class DocumentToSupplierDetailSerializer(serializers.ModelSerializer):
    body = WarehouseItemsDocumentSupplierToSerializer(
        many=True, source="warehouse_items"
    )

    supplier = serializers.StringRelatedField(
        source="supplier.company_name", read_only=True
    )
    supplier_id = serializers.PrimaryKeyRelatedField(
        queryset=SupplierRegistry.objects.all(), source="supplier", write_only=True
    )

    def create(self, validated_data):
        body_items = validated_data.pop("warehouse_items")
        error_messages = []

        with transaction.atomic():
            try:
                instance = super().create(validated_data)
            except Exception as e:
                raise serializers.ValidationError(
                    {"Detail": "Error creating document."}
                )

            for b_item in body_items:
                item_instance: WarehouseItems = b_item.pop("instance")

                if item_instance and item_instance.document_to_supplier != None:
                    error_messages.append(
                        {
                            "id": item_instance.id,
                            "message": "Item already related to another document customer",
                        }
                    )

                elif item_instance:
                    item_instance.document_to_supplier = instance
                    item_instance.save()
                else:
                    error_messages.append(
                        {
                            "id": item_instance.id,
                            "message": "Item id not found in database",
                        }
                    )

            if error_messages:
                raise serializers.ValidationError({"body": error_messages})

        return instance

    def update(self, instance: DocumentFromSupplier, validated_data):
        body_items = validated_data.pop("warehouse_items")
        error_messages = []

        with transaction.atomic():
            instance.warehouse_items.clear()

            for b_item in body_items:
                item_instance: WarehouseItems = b_item.pop("instance")

                if (
                    item_instance
                    and item_instance.document_to_supplier
                    and item_instance.document_to_supplier.id != instance.id
                ):
                    error_messages.append(
                        {
                            "id": item_instance.id,
                            "message": "Item already related to another document customer",
                        }
                    )

                elif item_instance:
                    item_instance.document_to_supplier = instance
                    item_instance.save()

                else:
                    error_messages.append(
                        {
                            "id": item_instance.id,
                            "message": "Item id not found in database",
                        }
                    )

            if error_messages:
                raise serializers.ValidationError({"body": error_messages})

        return super().update(instance, validated_data)

    class Meta:
        model = DocumentToSupplier
        exclude = ["created_at", "updated_at"]


####
# Warehouse
####


class WarehouseItemsCustomerEntrySerializer(serializers.Serializer):
    id_list = serializers.ListField(child=serializers.IntegerField())

    def validate(self, data):
        customer_id = self.context.get("customer_id")
        id_list = data.get("id_list", [])

        try:
            customer = CustomerRegistry.objects.get(pk=customer_id)
        except CustomerRegistry.DoesNotExist:
            raise serializers.ValidationError(
                {"customer_id": "Customer does not exist."}
            )

        items = WarehouseItems.objects.filter(
            document_customer__customer_id=customer.id, id__in=id_list
        )
        if items.count() != len(id_list):
            raise serializers.ValidationError(
                {
                    "id_list": "One or more items do not exist or are not associated with the customer."
                }
            )

        data["items"] = items
        data["customer"] = customer

        return data


class WarehouseItemsSerializer(serializers.ModelSerializer):
    item_type = WarehouseItemsRegistrySerializer(read_only=True)
    item_type_id = serializers.IntegerField(write_only=True)

    document_customer = DocumentCustomerSerializer(read_only=True)
    document_customer_id = serializers.IntegerField(write_only=True, required=False)

    customer_company_name = serializers.CharField(read_only=True)
    customer_company_code = serializers.CharField(read_only=True)
    document_customer_code = serializers.CharField(read_only=True)
    document_customer_date = serializers.CharField(read_only=True)
    supplier_from_company_name = serializers.CharField(read_only=True)
    supplier_from_company_code = serializers.CharField(read_only=True)
    document_to_supplier_name = serializers.CharField(read_only=True)
    document_to_supplier_code = serializers.CharField(read_only=True)
    empty_date = serializers.DateField(required=False, allow_null=True)

    id = serializers.IntegerField(read_only=True)
    # detail_url = serializers.HyperlinkedIdentityField(
    #     view_name="warehouse-items-detail", source="id"
    # )

    class Meta:
        model = WarehouseItems
        exclude = [
            "created_at",
            "updated_at",
        ]

        extra_kwargs = {
            "document_from_supplier": {"write_only": True},
            "document_to_supplier": {"write_only": True},
        }

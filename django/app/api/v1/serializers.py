import logging
from django.db import transaction, IntegrityError
from django.core.exceptions import ImproperlyConfigured
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from django.db.models import Q

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


class DocumentBaseSerializer(serializers.ModelSerializer):
    counterpart = serializers.SerializerMethodField()
    counterpart_code = serializers.SerializerMethodField()

    def get_counterpart(self, obj):
        field = getattr(obj, self.Meta.type)
        if field:
            return field.company_name
        return None

    def get_counterpart_code(self, obj):
        field = getattr(obj, self.Meta.type)
        if field:
            return field.external_code
        return None

    class Meta:
        exclude = ["created_at", "updated_at"]


class DocumentCustomerSerializer(DocumentBaseSerializer):
    status = serializers.ReadOnlyField(source="document_status")

    class Meta(DocumentBaseSerializer.Meta):
        model = DocumentCustomer
        type = "customer"


class DocumentFromSupplierSerializer(DocumentBaseSerializer):
    class Meta(DocumentBaseSerializer.Meta):
        model = DocumentFromSupplier
        type = "supplier"


class DocumentToSupplierSerializer(DocumentBaseSerializer):
    class Meta(DocumentBaseSerializer.Meta):
        model = DocumentToSupplier
        type = "supplier"


class WarehouseItemsRegistrySerializer(serializers.ModelSerializer):
    available_count = serializers.ReadOnlyField()

    class Meta:
        model = WarehouseItemsRegistry
        exclude = [
            "created_at",
            "updated_at",
        ]


class DocumentItemBaseSerializer(serializers.ModelSerializer):

    item_type = WarehouseItemsRegistrySerializer(read_only=True)

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)
        try:
            validated_data["instance"] = WarehouseItems.objects.filter(
                pk=data.get("id", None)
            ).first()
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


class DocumentSerializerBase(serializers.ModelSerializer):
    status = serializers.StringRelatedField(source="document_status", read_only=True)
    document_details = serializers.IntegerField(read_only=True)


class CustomerRegistrySerializer(serializers.ModelSerializer):
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


class SupplierRegistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierRegistry
        fields = "__all__"


class WarehouseItemsDocumentCustomerSerializer(DocumentItemBaseSerializer):
    class Meta(DocumentItemBaseSerializer.Meta):
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


class DocumentCustomerDetailSerializer(serializers.ModelSerializer):

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

            error_messages = save_document_bodies(
                body_items, instance, "document_customer"
            )
            if len(error_messages) != 0:
                raise serializers.ValidationError({"body": error_messages})

        return instance

    def update(self, instance: DocumentCustomer, validated_data):
        body_items = validated_data.pop("warehouse_items")

        with transaction.atomic():
            instance.warehouse_items.all().update(
                document_customer=None,
                status=WarehouseItems.WarehouseItemsStatus.AVAILABLE,
            )

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
                        "date": "Document already exist for this year",
                        "number": "Document already exist for this year",
                    }
                )

            if len(body_items) == 0:
                raise serializers.ValidationError({"detail": "Body can't be empty"})

            error_messages = save_document_bodies(
                body_items, instance, "document_customer"
            )
            if len(error_messages) != 0:
                raise serializers.ValidationError({"body": error_messages})
        return super().update(instance, validated_data)

    class Meta:
        model = DocumentCustomer
        exclude = ["created_at", "updated_at"]


class WarehouseItemsDocumentSupplierFromSerializer(DocumentItemBaseSerializer):

    item_type_id = serializers.PrimaryKeyRelatedField(
        queryset=WarehouseItemsRegistry.objects.all(),
        source="item_type",
        write_only=True,
        required=False,
    )

    def validate(self, attrs):
        if not attrs.get("instance"):
            item_type = attrs.get("item_type")
            batch_code = attrs.get("batch_code")
            if not item_type:
                raise serializers.ValidationError(
                    {"item_type": "This field  is required."}
                )

            if not batch_code:
                raise serializers.ValidationError(
                    {"batch_code": "This field  is required."}
                )

        return super().validate(attrs)

    class Meta(DocumentItemBaseSerializer.Meta):
        read_only_fields = [
            "item_type_description",
            "item_type_code",
            "status",
        ]

        extra_kwargs = {
            "custom_status": {"write_only": True},
            "batch_code": {"required": False},
        }


class DocumentFromSupplierDetailSerializer(serializers.ModelSerializer):
    body = WarehouseItemsDocumentSupplierFromSerializer(
        many=True, source="warehouse_items"
    )

    supplier = SupplierRegistrySerializer(read_only=True)

    supplier_id = serializers.PrimaryKeyRelatedField(
        queryset=SupplierRegistry.objects.all(), source="supplier", write_only=False
    )

    def create(self, validated_data):
        body_items = validated_data.pop("warehouse_items")

        with transaction.atomic():

            if self.Meta.model.objects.filter(
                year=validated_data["date"].year, number=validated_data["number"]
            ).exists():
                raise serializers.ValidationError(
                    {
                        "date": "Document already exist for this year",
                        "number": "Document already exist for this year",
                    }
                )

            try:
                instance = super().create(validated_data)
            except Exception as e:
                log.exception(e)
                raise serializers.ValidationError(
                    {"detail": "Error creating document."}
                )

            if len(body_items) == 0:
                raise serializers.ValidationError({"detail": "Body can't be empty"})

            for item in body_items:
                WarehouseItems.objects.create(
                    batch_code=item["batch_code"],
                    item_type=item["item_type"],
                    document_from_supplier=instance,
                )

        return instance

    def update(self, instance: DocumentFromSupplier, validated_data):
        body_items = validated_data.pop("warehouse_items")
        with transaction.atomic():
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
                        "date": "Document already exist for this year",
                        "number": "Document already exist for this year",
                    }
                )

            if len(body_items) == 0:
                raise serializers.ValidationError({"detail": "Body can't be empty"})

            body_items_id = []
            for item in body_items:
                item_instance = item.get("instance")

                if not item_instance:
                    item_instance = WarehouseItems.objects.create(
                        batch_code=item["batch_code"],
                        item_type=item["item_type"],
                        document_from_supplier=instance,
                    )

                body_items_id.append(item_instance.id)

            item_remove = instance.warehouse_items.exclude(id__in=body_items_id)

            if item_remove.filter(
                Q(document_to_supplier__isnull=False)
                | Q(document_customer__isnull=False)
                | Q(empty_date__isnull=False)
                # | ~Q(empty_date="")
            ).exists():
                raise serializers.ValidationError(
                    {"detail": "You cannot delete objects linked to other documents"}
                )

            item_remove.delete()
        return super().update(instance, validated_data)

    class Meta:
        model = DocumentFromSupplier
        exclude = ["created_at", "updated_at"]


class WarehouseItemsDocumentSupplierToSerializer(DocumentItemBaseSerializer):
    class Meta(DocumentItemBaseSerializer.Meta):
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

    supplier = SupplierRegistrySerializer(read_only=True)

    supplier_id = serializers.PrimaryKeyRelatedField(
        queryset=SupplierRegistry.objects.all(), source="supplier", write_only=False
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

            error_messages = save_document_bodies(
                body_items, instance, "document_to_supplier"
            )
            if len(error_messages) != 0:
                raise serializers.ValidationError({"body": error_messages})

        return instance

    def update(self, instance: DocumentCustomer, validated_data):
        body_items = validated_data.pop("warehouse_items")

        with transaction.atomic():
            for item in instance.warehouse_items.all():
                item.document_to_supplier = None
                item.save()

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
                        "date": "Document already exist for this year",
                        "number": "Document already exist for this year",
                    }
                )

            if len(body_items) == 0:
                raise serializers.ValidationError({"detail": "Body can't be empty"})

            error_messages = save_document_bodies(
                body_items, instance, "document_to_supplier"
            )
            if len(error_messages) != 0:
                raise serializers.ValidationError({"body": error_messages})
        return super().update(instance, validated_data)

    class Meta:
        model = DocumentToSupplier
        exclude = ["created_at", "updated_at"]


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

    document_from_supplier = DocumentFromSupplierSerializer(read_only=True)
    document_from_supplier_id = serializers.IntegerField(
        write_only=True, required=False
    )

    document_to_supplier = DocumentToSupplierSerializer(read_only=True)
    document_to_supplier_id = serializers.IntegerField(write_only=True, required=False)

    empty_date = serializers.DateField(required=False, allow_null=True)

    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = WarehouseItems
        exclude = [
            "created_at",
            "updated_at",
        ]


class WarehouseItemsReturnSerializer(WarehouseItemsSerializer):

    days_left = serializers.IntegerField()

    document_from_supplier = None
    document_from_supplier_id = None
    document_to_supplier = None
    document_to_supplier_id = None

    class Meta(WarehouseItemsSerializer.Meta):
        model = WarehouseItems
        exclude = [
            "created_at",
            "updated_at",
        ]

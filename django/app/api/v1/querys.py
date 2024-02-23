from django.db.models import Case, When, Value, CharField, Count, F, Sum, IntegerField
from django.db.models.functions import ExtractDay, Coalesce
from django.utils import timezone as tz

from app.core.models import (
    CustomerRegistry,
    SupplierRegistry,
    DocumentCustomer,
    WarehouseItems,
    WarehouseItemsRegistry,
    DocumentFromSupplier,
    DocumentToSupplier,
)


class DocumentCustomerQuery:

    @staticmethod
    def document_customer_list():
        base_queryset = (
            DocumentCustomer.objects.select_related(
                "customer",
            )
            .prefetch_related("warehouse_items", "warehouse_items__item_type")
            .annotate(
                open_count=Count(
                    Case(
                        When(
                            warehouse_items__status=WarehouseItems.WarehouseItemsStatus.BOOKED,
                            then=Value(1),
                        ),
                        default=None,
                    )
                ),
                closed_count=Count(
                    Case(
                        When(
                            warehouse_items__status__in=[
                                WarehouseItems.WarehouseItemsStatus.EMPTY,
                                WarehouseItems.WarehouseItemsStatus.RETURNED,
                            ],
                            then=Value(1),
                        ),
                        default=None,
                    )
                ),
                total_count=Count("warehouse_items__id", output_field=CharField()),
            )
            .distinct()
        )

        return base_queryset.annotate(
            document_status=Case(
                When(total_count=0, then=Value("Empty")),
                When(open_count=0, closed_count__gt=0, then=Value("Closed")),
                When(open_count__gt=0, closed_count=0, then=Value("Open")),
                default=Value("Partial"),
                output_field=CharField(),
            ),
            document_details=F("total_count"),
        )

    @staticmethod
    def document_customer_detail(pk):
        base_queryset = (
            DocumentCustomer.objects.filter(pk=pk)
            .select_related(
                "customer",
            )
            .prefetch_related("warehouse_items", "warehouse_items__item_type")
            .annotate(
                open_count=Count(
                    Case(
                        When(
                            warehouse_items__status=WarehouseItems.WarehouseItemsStatus.BOOKED,
                            then=Value(1),
                        ),
                        default=None,
                    )
                ),
                closed_count=Count(
                    Case(
                        When(
                            warehouse_items__status__in=[
                                WarehouseItems.WarehouseItemsStatus.EMPTY,
                                WarehouseItems.WarehouseItemsStatus.RETURNED,
                            ],
                            then=Value(1),
                        ),
                        default=None,
                    )
                ),
                total_count=Count("warehouse_items__id", output_field=CharField()),
            )
            .distinct()
        )

        return base_queryset.annotate(
            document_status=Case(
                When(total_count=0, then=Value("Empty")),
                When(open_count=0, closed_count__gt=0, then=Value("Closed")),
                When(open_count__gt=0, closed_count=0, then=Value("Open")),
                default=Value("Partial"),
                output_field=CharField(),
            ),
            document_details=F("total_count"),
        )


class WarehouseItemsQuery:

    @staticmethod
    def warehouse_items_list():
        base_queryset = WarehouseItems.objects.select_related(
            "document_customer__customer",
            "document_from_supplier__supplier",
            "document_to_supplier__supplier",
            "item_type",
        ).annotate(
            customer_company_name=F("document_customer__customer__company_name"),
            customer_company_code=F("document_customer__customer__external_code"),
            supplier_from_company_name=F(
                "document_from_supplier__supplier__company_name"
            ),
            supplier_from_company_code=F(
                "document_from_supplier__supplier__external_code"
            ),
            document_to_supplier_name=F("document_to_supplier__supplier__company_name"),
            document_to_supplier_code=F(
                "document_to_supplier__supplier__external_code"
            ),
            item_type_description=F("item_type__description"),
            item_type_code=F("item_type__internal_code"),
        )
        return base_queryset

    @staticmethod
    def warehouse_items_available_list(status):
        base_queryset = (
            WarehouseItems.objects.select_related(
                "document_customer__customer",
                "document_from_supplier__supplier",
                "document_to_supplier__supplier",
                "item_type",
            )
            .filter(status__in=status)
            .annotate(
                customer_company_name=F("document_customer__customer__company_name"),
                customer_company_code=F("document_customer__customer__external_code"),
                supplier_from_company_name=F(
                    "document_from_supplier__supplier__company_name"
                ),
                supplier_from_company_code=F(
                    "document_from_supplier__supplier__external_code"
                ),
                document_to_supplier_name=F(
                    "document_to_supplier__supplier__company_name"
                ),
                document_to_supplier_code=F(
                    "document_to_supplier__supplier__external_code"
                ),
                item_type_description=F("item_type__description"),
                item_type_code=F("item_type__internal_code"),
            )
        )
        return base_queryset

    @staticmethod
    def warehouse_items_detail(pk):
        base_queryset = (
            WarehouseItems.objects.filter(pk=pk)
            .select_related(
                "document_customer__customer",
                "document_from_supplier__supplier",
                "document_to_supplier__supplier",
                "item_type",
            )
            .annotate(
                customer_company_name=F("document_customer__customer__company_name"),
                customer_company_code=F("document_customer__customer__external_code"),
                document_customer_code=F("document_customer__number"),
                document_customer_date=F("document_customer__date"),
                supplier_from_company_name=F(
                    "document_from_supplier__supplier__company_name"
                ),
                supplier_from_company_code=F(
                    "document_from_supplier__supplier__external_code"
                ),
                document_to_supplier_name=F(
                    "document_to_supplier__supplier__company_name"
                ),
                document_to_supplier_code=F(
                    "document_to_supplier__supplier__external_code"
                ),
            )
        )
        return base_queryset

    @staticmethod
    def warehouse_items_return():
        today = tz.now().date()
        base_queryset = (
            WarehouseItems.objects.filter(
                status=WarehouseItems.WarehouseItemsStatus.BOOKED
            )
            .select_related(
                "document_customer__customer",
                "document_customer",
                "item_type",
            )
            .annotate(
                days_left=Coalesce(
                    ExtractDay(today - F("document_customer__date")), Value(0)
                )
            )
        )
        return base_queryset


class DocumentFromSupplierQuery:

    @staticmethod
    def document_from_supplier_list():
        base_queryset = (
            DocumentFromSupplier.objects.select_related(
                "supplier",
            )
            .prefetch_related("warehouse_items", "warehouse_items__item_type")
            .annotate(
                total_count=Count("warehouse_items__id", output_field=CharField()),
            )
            .distinct()
        )

        base_queryset = base_queryset.annotate(
            document_details=F("total_count"),
        )
        return base_queryset


class DocumentToSupplierQuery:

    @staticmethod
    def document_to_supplier_list():
        base_queryset = (
            DocumentToSupplier.objects.select_related(
                "supplier",
            )
            .prefetch_related("warehouse_items", "warehouse_items__item_type")
            .annotate(
                total_count=Count("warehouse_items__id", output_field=CharField()),
            )
            .distinct()
        )

        base_queryset = base_queryset.annotate(
            document_details=F("total_count"),
        )
        return base_queryset


class WarehouseItemsRegistryQuery:
    @staticmethod
    def document_to_supplier_list():
        base_queryset = WarehouseItemsRegistry.objects.all().annotate(
            available_count=Sum(
                Case(
                    When(warehouse_items__status="A", then=Value(1)),
                    default=Value(0),
                    output_field=IntegerField(),
                )
            )
        )
        return base_queryset

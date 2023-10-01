from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Case, When, Value, CharField, Count, QuerySet, F


from app.core.api_v1.serializers import (
    CustomerRegistrySerializer,
    SupplierRegistrySerializer,
    DocumentCustomerSerializer,
    WarehouseItemsSerializer,
)
from app.core.api_v1.paginations import BasicPaginationController
from app.core.models import (
    CustomerRegistry,
    SupplierRegistry,
    DocumentCustomer,
    WarehouseItems,
)


class SupplierRegistryApiView(ListCreateAPIView):
    pagination_class = BasicPaginationController
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["company_name", "external_code"]
    ordering_fields = ["external_code", "company_name", "vat_number"]

    serializer_class = SupplierRegistrySerializer
    queryset = SupplierRegistry.objects.all()


class CustomerRegistryApiView(ListCreateAPIView):
    pagination_class = BasicPaginationController
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["company_name", "external_code"]
    ordering_fields = ["external_code", "company_name", "vat_number"]

    serializer_class = CustomerRegistrySerializer
    queryset = CustomerRegistry.objects.all()


class CustomerRegistryDetailApiView(RetrieveUpdateAPIView):
    serializer_class = CustomerRegistrySerializer
    queryset = CustomerRegistry.objects.all()
    lookup_field = "pk"


class DocumentCustomerApiView(ListCreateAPIView):
    pagination_class = BasicPaginationController
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["customer__company_name", "date", "number", "document_status"]
    ordering_fields = [
        "customer__company_name",
        "date",
        "year",
        "number",
        "document_status",
    ]

    serializer_class = DocumentCustomerSerializer
    
    @staticmethod
    def base_queryset():
        base_queryset = DocumentCustomer.objects.select_related(
            'customer',
        ).prefetch_related(
            'warehouse_items',
            'warehouse_items__item_type'
        ).annotate(
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
        ).distinct()

        base_queryset = base_queryset.annotate(
            document_status=Case(
                When(total_count=0, then=Value("Empty")),
                When(open_count=0, closed_count__gt=0, then=Value("Closed")),
                When(open_count__gt=0, closed_count=0, then=Value("Open")),
                default=Value("Partial"),
                output_field=CharField(),
            )
        )
        return  base_queryset
        
    def get_queryset(self):
        queryset = self.base_queryset()
        return queryset


class DocumentCustomerDetailApiView(RetrieveUpdateAPIView):
    serializer_class = DocumentCustomerSerializer
    lookup_field = "pk"

    def get_queryset(self):
        queryset = DocumentCustomerApiView.base_queryset()
        return queryset


class WarehouseItemsApiView(ListCreateAPIView):
    pagination_class = BasicPaginationController
    serializer_class = WarehouseItemsSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "document_customer__customer__company_name",
        "document_from_supplier__supplier__company_name",
        "document_to_supplier__supplier__company_name",
        "document_customer__date",
        "document_from_supplier__date",
        "document_to_supplier__date",
        "empty_date",
        "batch_code",
        "item_type__description" "item_type__internal_code" "status",
    ]
    ordering_fields = ["empty_date", "batch_code", "item_type__internal_code", "status"]
    
    @staticmethod
    def base_queryset():
        base_queryset = WarehouseItems.objects.select_related(
            'document_customer__customer',
            'document_from_supplier__supplier',
            'document_to_supplier__supplier',
            'item_type'
        ).annotate(
            customer_company_name=F('document_customer__customer__company_name'),
            customer_company_code=F('document_customer__customer__external_code'),
            supplier_from_company_name=F('document_from_supplier__supplier__company_name'),
            supplier_from_company_code=F('document_from_supplier__supplier__external_code'),
            document_to_supplier_name=F('document_to_supplier__supplier__company_name'),
            document_to_supplier_code=F('document_to_supplier__supplier__external_code'),
            item_type_description=F('item_type__description'),
            item_type_code=F('item_type__internal_code'),
        )
        return base_queryset
    
    def get_queryset(self):
        queryset = self.base_queryset()
        return queryset

class WarehouseItemsDetailApiView(RetrieveUpdateAPIView):
    serializer_class = WarehouseItemsSerializer
    lookup_field = "pk"
    
    def get_queryset(self):
        queryset = WarehouseItemsApiView.base_queryset()
        return queryset
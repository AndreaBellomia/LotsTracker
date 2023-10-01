from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateAPIView,
    CreateAPIView,
    ListAPIView,
)
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Case, When, Value, CharField, Count, QuerySet, F


from app.api.v1.serializers import (
    CustomerRegistrySerializer,
    SupplierRegistrySerializer,
    DocumentCustomerSerializer,
    WarehouseItemsSerializer,
    WarehouseItemsRegistrySerializer,
    DocumentFromSupplierSerializer,
    DocumentFromSupplierDetailSerializer,
    DocumentToSupplierSerializer,
    DocumentToSupplierDetailSerializer,
)
from app.api.v1.paginations import BasicPaginationController
from app.core.models import (
    CustomerRegistry,
    SupplierRegistry,
    DocumentCustomer,
    WarehouseItems,
    WarehouseItemsRegistry,
    DocumentFromSupplier,
    DocumentToSupplier,
)




class SupplierRegistryApiView(ListCreateAPIView):
    pagination_class = BasicPaginationController
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["company_name", "external_code"]
    ordering_fields = ["external_code", "company_name", "vat_number"]

    serializer_class = SupplierRegistrySerializer
    queryset = SupplierRegistry.objects.all()


class SupplierRegistryDetailApiView(RetrieveUpdateAPIView):
    serializer_class = SupplierRegistrySerializer
    queryset = SupplierRegistry.objects.all()
    lookup_field = "pk"


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


class DocumentCustomerCreateApiView(CreateAPIView):
    serializer_class = DocumentCustomerSerializer

    @staticmethod
    def base_queryset():
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

        base_queryset = base_queryset.annotate(
            document_status=Case(
                When(total_count=0, then=Value("Empty")),
                When(open_count=0, closed_count__gt=0, then=Value("Closed")),
                When(open_count__gt=0, closed_count=0, then=Value("Open")),
                default=Value("Partial"),
                output_field=CharField(),
            ),
            document_details=F("total_count"),
        )
        return base_queryset

    def get_queryset(self):
        queryset = self.base_queryset()
        return queryset


class DocumentCustomerListApiView(ListAPIView):
    pagination_class = BasicPaginationController
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "customer__company_name",
        "customer__external_code",
        "date",
        "number",
        "document_status",
    ]
    ordering_fields = [
        "customer__company_name",
        "date",
        "year",
        "number",
        "document_status",
        "customer__external_code",
        "document_details",
    ]

    serializer_class = DocumentCustomerSerializer

    def get_queryset(self):
        queryset = DocumentCustomerCreateApiView.base_queryset()
        return queryset


class DocumentCustomerDetailApiView(RetrieveUpdateAPIView):
    serializer_class = DocumentCustomerSerializer
    lookup_field = "pk"

    def get_queryset(self):
        queryset = DocumentCustomerCreateApiView.base_queryset()
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

    def get_queryset(self):
        queryset = self.base_queryset()
        return queryset


class WarehouseItemsDetailApiView(RetrieveUpdateAPIView):
    serializer_class = WarehouseItemsSerializer
    lookup_field = "pk"

    def get_queryset(self):
        queryset = WarehouseItemsApiView.base_queryset()
        return queryset


class WarehouseItemsRegistryApiView(ListCreateAPIView):
    pagination_class = None
    serializer_class = WarehouseItemsRegistrySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "description",
        "external_code",
        "internal_code",
    ]
    ordering_fields = ["description", "external_code", "internal_code"]
    queryset = WarehouseItemsRegistry.objects.all()


class WarehouseItemsRegistryDetailApiView(RetrieveUpdateAPIView):
    serializer_class = WarehouseItemsRegistrySerializer
    queryset = WarehouseItemsRegistry.objects.all()
    lookup_field = "pk"


class DocumentFromSupplierCreateApiView(CreateAPIView):
    serializer_class = DocumentFromSupplierDetailSerializer

    @staticmethod
    def base_queryset():
        base_queryset = (
            DocumentFromSupplier.objects.select_related(
                "supplier",
            )
            .prefetch_related("warehouse_items", "warehouse_items__item_type")
            .annotate(
                total_count=Count("warehouse_items__id", output_field=CharField()),
            ).distinct()
        )

        base_queryset = base_queryset.annotate(
            document_details=F("total_count"),
        )
        return base_queryset

    def get_queryset(self):
        queryset = self.base_queryset()
        return queryset



class DocumentFromSupplierListApiView(ListAPIView):
    pagination_class = BasicPaginationController
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "supplier__company_name",
        "supplier__external_code",
        "date",
        "number",
        "document_status",
    ]
    ordering_fields = [
        "supplier__company_name",
        "date",
        "year",
        "number",
        "document_status",
        "supplier__external_code",
        "document_details",
    ]

    serializer_class = DocumentFromSupplierSerializer

    def get_queryset(self):
        queryset = DocumentFromSupplierCreateApiView.base_queryset()
        return queryset
    
    
class DocumentFromSupplierDetailApiView(RetrieveUpdateAPIView):
    serializer_class = DocumentFromSupplierDetailSerializer
    lookup_field = "pk"

    def get_queryset(self):
        queryset = DocumentFromSupplierCreateApiView.base_queryset()
        return queryset
    
    
    
    
    
    
    
class DocumentToSupplierCreateApiView(CreateAPIView):
    serializer_class = DocumentToSupplierDetailSerializer

    @staticmethod
    def base_queryset():
        base_queryset = (
            DocumentToSupplier.objects.select_related(
                "supplier",
            )
            .prefetch_related("warehouse_items", "warehouse_items__item_type")
            .annotate(
                total_count=Count("warehouse_items__id", output_field=CharField()),
            ).distinct()
        )

        base_queryset = base_queryset.annotate(
            document_details=F("total_count"),
        )
        return base_queryset

    def get_queryset(self):
        queryset = self.base_queryset()
        return queryset

class DocumentToSupplierListApiView(ListAPIView):
    pagination_class = BasicPaginationController
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "supplier__company_name",
        "supplier__external_code",
        "date",
        "number",
        "document_status",
    ]
    ordering_fields = [
        "supplier__company_name",
        "date",
        "year",
        "number",
        "document_status",
        "supplier__external_code",
        "document_details",
    ]

    serializer_class = DocumentToSupplierSerializer

    def get_queryset(self):
        queryset = DocumentToSupplierCreateApiView.base_queryset()
        return queryset
    
    
class DocumentToSupplierDetailApiView(RetrieveUpdateAPIView):
    serializer_class = DocumentToSupplierDetailSerializer
    lookup_field = "pk"

    def get_queryset(self):
        queryset = DocumentToSupplierCreateApiView.base_queryset()
        return queryset
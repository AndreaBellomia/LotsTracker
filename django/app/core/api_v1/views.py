from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Case, When, Value, CharField, Count, QuerySet


from app.core.api_v1.serializers import (
    CustomerRegistrySerializer,
    SupplierRegistrySerializer,
    DocumentCustomerSerializer,
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
    ordering_fields = ["customer__company_name", "date", "year", "number", "document_status"]

    serializer_class = DocumentCustomerSerializer

    def get_queryset(self):
        queryset = DocumentCustomer.objects.annotate(
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

        queryset = queryset.annotate(
            document_status=Case(
                When(total_count=0, then=Value("Empty")),
                When(open_count=0, closed_count__gt=0, then=Value("Closed")),
                When(open_count__gt=0, closed_count=0, then=Value("Open")),
                default=Value("Partial"),
                output_field=CharField(),
            )
        )

        return queryset

class DocumentCustomerDetailApiView(RetrieveUpdateAPIView):
    serializer_class = DocumentCustomerSerializer
    lookup_field = "pk"
    
    def get_queryset(self):
        
        queryset = DocumentCustomer.objects.filter(
            pk=self.kwargs["pk"]
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

        queryset = queryset.annotate(
            document_status=Case(
                When(total_count=0, then=Value("Empty")),
                When(open_count=0, closed_count__gt=0, then=Value("Closed")),
                When(open_count__gt=0, closed_count=0, then=Value("Open")),
                default=Value("Partial"),
                output_field=CharField(),
            )
        )

        return queryset
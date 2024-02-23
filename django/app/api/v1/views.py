from rest_framework import filters, status
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateAPIView,
    CreateAPIView,
    ListAPIView,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from django.db import transaction
from django.db.models import Case, When, Value, CharField, Count, F
from django.utils import timezone as tz

from app.api.v1.paginations import BasicPaginationController
from app.api.v1.serializers import (
    CustomerRegistrySerializer,
    SupplierRegistrySerializer,
    DocumentCustomerSerializer,
    DocumentCustomerDetailSerializer,
    WarehouseItemsReturnSerializer,
    WarehouseItemsSerializer,
    WarehouseItemsRegistrySerializer,
    DocumentFromSupplierSerializer,
    DocumentFromSupplierDetailSerializer,
    DocumentToSupplierSerializer,
    DocumentToSupplierDetailSerializer,
    WarehouseItemsCustomerEntrySerializer,
)
from app.core.models import (
    CustomerRegistry,
    SupplierRegistry,
    DocumentCustomer,
    WarehouseItems,
    WarehouseItemsRegistry,
    DocumentFromSupplier,
    DocumentToSupplier,
)

from app.api.v1.querys import (
    DocumentCustomerQuery,
    WarehouseItemsQuery,
    DocumentFromSupplierQuery,
    DocumentToSupplierQuery,
    WarehouseItemsRegistryQuery,
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
    serializer_class = DocumentCustomerDetailSerializer

    def get_queryset(self):
        queryset = DocumentCustomerQuery.document_customer_list()
        return queryset


class DocumentCustomerListApiView(ListAPIView):
    pagination_class = BasicPaginationController
    serializer_class = DocumentCustomerSerializer
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

    def get_queryset(self):
        queryset = DocumentCustomerQuery.document_customer_list()
        return queryset


class DocumentCustomerDetailApiView(RetrieveUpdateAPIView):
    serializer_class = DocumentCustomerDetailSerializer
    lookup_field = "pk"

    def get_queryset(self):
        queryset = DocumentCustomerQuery.document_customer_detail(self.kwargs["pk"])
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
        "item_type__description",
        "item_type__internal_code",
        "status",
    ]
    ordering_fields = ["empty_date", "batch_code", "item_type__internal_code", "status"]

    def get_queryset(self):
        queryset = WarehouseItemsQuery.warehouse_items_list()
        return queryset


class WarehouseItemsStatusApiView(ListCreateAPIView):
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
        "item_type__description",
        "item_type__internal_code",
    ]
    ordering_fields = ["empty_date", "batch_code", "item_type__internal_code"]

    def get_queryset(self):
        status = self.kwargs["status"].split(",")

        for st in status:
            if not st in WarehouseItems.WarehouseItemsStatus.values:
                raise NotFound(
                    f"invalid status value {st}, the valid status are: [{WarehouseItems.WarehouseItemsStatus.values}]"
                )

        queryset = WarehouseItemsQuery.warehouse_items_available_list(status)
        return queryset


class WarehouseItemsDetailApiView(RetrieveUpdateAPIView):
    serializer_class = WarehouseItemsSerializer
    lookup_field = "pk"

    def get_queryset(self):
        queryset = WarehouseItemsQuery.warehouse_items_detail(self.kwargs["pk"])
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
    ordering_fields = [
        "description",
        "external_code",
        "internal_code",
        "available_count",
    ]

    def get_queryset(self):
        queryset = WarehouseItemsRegistryQuery.document_to_supplier_list()
        return queryset


class WarehouseItemsRegistryDetailApiView(RetrieveUpdateAPIView):
    serializer_class = WarehouseItemsRegistrySerializer
    queryset = WarehouseItemsRegistry.objects.all()
    lookup_field = "pk"


class DocumentFromSupplierCreateApiView(CreateAPIView):
    serializer_class = DocumentFromSupplierDetailSerializer

    def get_queryset(self):
        queryset = DocumentFromSupplierQuery.document_from_supplier_list()
        return queryset


class DocumentFromSupplierListApiView(ListAPIView):
    pagination_class = BasicPaginationController
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "supplier__company_name",
        "supplier__external_code",
        "date",
        "number",
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
        queryset = DocumentFromSupplierQuery.document_from_supplier_list()
        return queryset


class DocumentFromSupplierDetailApiView(RetrieveUpdateAPIView):
    serializer_class = DocumentFromSupplierDetailSerializer
    lookup_field = "pk"

    def get_queryset(self):
        queryset = DocumentFromSupplierQuery.document_from_supplier_list()
        return queryset


class DocumentToSupplierCreateApiView(CreateAPIView):
    serializer_class = DocumentToSupplierDetailSerializer

    def get_queryset(self):
        queryset = DocumentToSupplierQuery.document_to_supplier_list()
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
        queryset = DocumentToSupplierQuery.document_to_supplier_list()
        return queryset


class DocumentToSupplierDetailApiView(RetrieveUpdateAPIView):
    serializer_class = DocumentToSupplierDetailSerializer
    lookup_field = "pk"

    def get_queryset(self):
        queryset = DocumentToSupplierQuery.document_to_supplier_list()
        return queryset


class WarehouseItemsCustomerEntryApiView(APIView):
    serializer_class = WarehouseItemsCustomerEntrySerializer

    def post(self, request, *args, **kwargs):
        customer_id = kwargs.pop("counterpart")

        serializer = self.serializer_class(
            data=request.data, context={"customer_id": customer_id}
        )
        if serializer.is_valid():
            with transaction.atomic():
                for item in serializer.validated_data["items"]:
                    try:
                        item.empty_date = tz.localdate()
                        item.save()
                    except:
                        return Response(
                            {"Error": "Error during save."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
            return Response(serializer.errors, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WarehouseItemsEntryApiView(APIView):
    def post(self, request, *args, **kwargs):
        warehouse_item = kwargs.pop("warehouse_item")

        try:
            instance = WarehouseItems.objects.get(pk=warehouse_item)
        except WarehouseItems.DoesNotExist:
            return Response(
                {"Error": "Item not exist"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            instance.empty_date = tz.localdate()
            instance.save()
            return Response({"Success": "Update success."}, status=status.HTTP_200_OK)
        except:
            return Response(
                {"Error": "Error during save."}, status=status.HTTP_400_BAD_REQUEST
            )


class CustomerWarehouseItemsApiView(ListAPIView):
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
        "item_type__description",
        "item_type__internal_code",
        "status",
    ]
    ordering_fields = ["empty_date", "batch_code", "item_type__internal_code", "status"]

    def get_queryset(self):
        customer_pk = self.kwargs["pk"]
        queryset = WarehouseItemsQuery.warehouse_items_list().filter(
            document_customer__customer__pk=customer_pk
        )
        return queryset


class WarehouseItemsReturnApiView(ListAPIView):
    pagination_class = BasicPaginationController
    serializer_class = WarehouseItemsReturnSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "document_customer__customer__company_name",
        "document_customer__customer__vat_number",
        "document_customer__customer__external_code",
        "batch_code",
        "item_type__description",
        "item_type__internal_code",
    ]
    
    ordering_fields = ["document_customer__customer__company_name", "document_customer__customer__external_code", "batch_code", "days_left"]
    
    def get_queryset(self):
        queryset = WarehouseItemsQuery.warehouse_items_return()
        return queryset

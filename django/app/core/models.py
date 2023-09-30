from typing import Any
from django.db import models

from django.db.models import Case, When, Value, CharField, Count, QuerySet
from django.http import QueryDict


class AbstractBaseModel(models.Model):
    """
    Abstract Base Model for all other models
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SupplierRegistry(AbstractBaseModel):
    """
    Registry of all suppliers
    """

    external_code = models.CharField(max_length=50, db_index=True, unique=True)
    company_name = models.CharField(max_length=250)
    vat_number = models.CharField(max_length=50, db_index=True)

    class Meta:
        unique_together = (("company_name"), ("vat_number"))

    def __str__(self) -> str:
        return self.company_name + " - " + self.external_code


class CustomerRegistry(AbstractBaseModel):
    """
    Registry of all suppliers
    """

    external_code = models.CharField(max_length=50, db_index=True, unique=True)
    company_name = models.CharField(max_length=250)
    vat_number = models.CharField(max_length=50, db_index=True)

    class Meta:
        unique_together = (("company_name"), ("vat_number"))

    def __str__(self) -> str:
        return self.company_name + " - " + self.external_code


class DocumentFromSupplier(AbstractBaseModel):
    """
    Registry of all documents from a supplier
    """

    supplier = models.ForeignKey(
        SupplierRegistry,
        on_delete=models.CASCADE,
        related_name="document_from_supplier",
    )
    date = models.DateField()
    number = models.CharField(max_length=50, db_index=True)

    year = models.IntegerField(editable=False)

    def save(self, *args, **kwargs):
        self.year = self.date.year
        super().save(*args, **kwargs)

    class Meta:
        unique_together = (("year"), ("number"))


class DocumentToSupplier(AbstractBaseModel):
    """
    Registry of all documents to a supplier
    """

    supplier = models.ForeignKey(
        SupplierRegistry, on_delete=models.CASCADE, related_name="document_to_supplier"
    )
    date = models.DateField()
    number = models.CharField(max_length=50, db_index=True)

    year = models.IntegerField(editable=False)

    def save(self, *args, **kwargs):
        self.year = self.date.year
        super().save(*args, **kwargs)

    class Meta:
        unique_together = (("year"), ("number"))


class DocumentCustomer(AbstractBaseModel):
    """
    Registry of all documents to a customer
    """

    customer = models.ForeignKey(
        CustomerRegistry,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        default=None,
        db_index=True,
        related_name="document_customer",
    )
    date = models.DateField(db_index=True)
    number = models.CharField(max_length=50, db_index=True)

    year = models.IntegerField(editable=False)

    def save(self, *args, **kwargs):
        self.year = self.date.year
        super().save(*args, **kwargs)

    def get_status(self):
        status = self.warehouse_items.aggregate(
            open_count=Count(
                Case(
                    When(
                        status=WarehouseItems.WarehouseItemsStatus.BOOKED, then=Value(1)
                    ),
                    default=None,
                )
            ),
            closed_count=Count(
                Case(
                    When(
                        status=WarehouseItems.WarehouseItemsStatus.EMPTY, then=Value(1)
                    ),
                    When(
                        status=WarehouseItems.WarehouseItemsStatus.RETURNED,
                        then=Value(1),
                    ),
                    default=None,
                )
            ),
            total_count=Count("id"),
        )

        if status["total_count"] > 0:
            if status["open_count"] and not status["closed_count"]:
                return "Open"
            elif status["closed_count"] and not status["open_count"]:
                return "Closed"
            else:
                return "Partial"
        else:
            return "Empty"

    class Meta:
        unique_together = (("year"), ("number"))


class WarehouseItemsRegistry(AbstractBaseModel):
    """
    Registry of all articles
    """

    description = models.CharField(max_length=250)
    external_code = models.CharField(
        max_length=50, null=True, blank=True, db_index=True
    )
    internal_code = models.CharField(max_length=50, db_index=True, unique=True)

    def __str__(self) -> str:
        return self.internal_code + " - " + self.description


class WarehouseItems(AbstractBaseModel):
    """
    Main model
    """

    class WarehouseItemsStatus(models.TextChoices):
        AVAILABLE = "A", "Available"
        BOOKED = "B", "Booked"
        EMPTY = "E", "Empty"
        RETURNED = "R", "Returned"

    empty_date = models.DateField(null=True, blank=True, db_index=True)
    batch_code = models.CharField(max_length=100, db_index=True)
    item_type = models.ForeignKey(
        WarehouseItemsRegistry, on_delete=models.CASCADE, related_name="warehouse_items"
    )

    document_from_supplier = models.ForeignKey(
        DocumentFromSupplier,
        on_delete=models.SET_NULL,
        related_name="warehouse_items",
        null=True,
        blank=True,
        default=None,
    )
    document_to_supplier = models.ForeignKey(
        DocumentToSupplier,
        on_delete=models.SET_NULL,
        related_name="warehouse_items",
        null=True,
        blank=True,
        default=None,
    )
    document_customer = models.ForeignKey(
        DocumentCustomer,
        on_delete=models.CASCADE,
        related_name="warehouse_items",
        null=True,
        blank=True,
        default=None,
    )

    custom_status = models.CharField(
        max_length=1,
        choices=WarehouseItemsStatus.choices,
        null=True,
        blank=True,
        default=None,
    )

    status = models.CharField(
        max_length=1,
        choices=WarehouseItemsStatus.choices,
        editable=False,
        null=True,
        blank=True,
    )

    def _get_current_status(self):
        if self.document_to_supplier:
            return self.WarehouseItemsStatus.RETURNED
        elif self.empty_date:
            return self.WarehouseItemsStatus.EMPTY
        elif self.document_customer:
            return self.WarehouseItemsStatus.BOOKED
        elif self.document_from_supplier:
            return self.WarehouseItemsStatus.AVAILABLE
        else:
            return self.WarehouseItemsStatus.AVAILABLE

    def _get_auto_update_of_status(self):
        return (
            self._empty_date != self.empty_date
            or self._document_from_supplier != self.document_from_supplier
            or self._document_to_supplier != self.document_to_supplier
            or self._document_customer != self.document_customer
        )

    def save(self, *args, **kwargs):
        _status = None
        if self.custom_status and not self._get_auto_update_of_status():
            _status = self.custom_status
        else:
            self.custom_status = None
            _status = self._get_current_status()
        self.status = _status
        super().save(*args, **kwargs)

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self._empty_date = self.empty_date
        self._document_from_supplier = self.document_from_supplier
        self._document_to_supplier = self.document_to_supplier
        self._document_customer = self.document_customer
        self._custom_status = self.custom_status

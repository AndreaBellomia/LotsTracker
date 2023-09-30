from enum import unique
import re
from tabnanny import verbose
from django.db import models

# Create your models here.


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

    supplier = models.ForeignKey(SupplierRegistry, on_delete=models.CASCADE)
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

    supplier = models.ForeignKey(SupplierRegistry, on_delete=models.CASCADE)
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

    customer = models.ForeignKey(CustomerRegistry, on_delete=models.CASCADE, blank=True, null=True, default=None, db_index=True)
    date = models.DateField(db_index=True)
    number = models.CharField(max_length=50, db_index=True)

    year = models.IntegerField(editable=False)

    def save(self, *args, **kwargs):
        self.year = self.date.year
        super().save(*args, **kwargs)

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

    status = models.CharField(
        max_length=1,
        choices=WarehouseItemsStatus.choices,
        editable=False,
        null=True,
        blank=True,
    )
    
    custom_status = models.CharField(
        max_length=1,
        choices=WarehouseItemsStatus.choices,
        null=True,
        blank=True,
        default=None,
    )
    empty_date = models.DateField(null=True, blank=True, db_index=True)
    batch_code = models.CharField(max_length=100, db_index=True)
    
    item_type = models.ForeignKey(WarehouseItemsRegistry, on_delete=models.CASCADE, related_name="items_type")

    document_from_supplier = models.ForeignKey(
        DocumentFromSupplier,
        on_delete=models.SET_NULL,
        related_name="document_from_supplier",
        null=True,
        blank=True,
        default=None,
    )
    document_to_supplier = models.ForeignKey(
        DocumentToSupplier,
        on_delete=models.SET_NULL,
        related_name="document_to_supplier",
        null=True,
        blank=True,
        default=None,
    )
    document_customer = models.ForeignKey(
        DocumentCustomer,
        on_delete=models.CASCADE,
        related_name="document_customer",
        null=True,
        blank=True,
        default=None,
    )

    def save(self, *args, **kwargs):
        
        _status = None
        if self.custom_status:
            _status = self.custom_status
        else:
            if self.document_to_supplier:
                _status = self.WarehouseItemsStatus.RETURNED
            elif self.empty_date:
                _status = self.WarehouseItemsStatus.EMPTY
            elif self.document_customer:
                _status = self.WarehouseItemsStatus.BOOKED
            elif self.document_from_supplier:
                _status = self.WarehouseItemsStatus.AVAILABLE
        self.status = _status
        super().save(*args, **kwargs)
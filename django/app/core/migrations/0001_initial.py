# Generated by Django 4.2.1 on 2023-09-30 14:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="CustomerRegistry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "external_code",
                    models.CharField(db_index=True, max_length=50, unique=True),
                ),
                ("company_name", models.CharField(max_length=250)),
                ("vat_number", models.CharField(db_index=True, max_length=50)),
            ],
            options={
                "unique_together": {("company_name", "vat_number")},
            },
        ),
        migrations.CreateModel(
            name="DocumentCustomer",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("date", models.DateField()),
                ("number", models.CharField(db_index=True, max_length=50)),
                ("year", models.IntegerField(editable=False)),
                (
                    "customer",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="core.customerregistry",
                    ),
                ),
            ],
            options={
                "unique_together": {("year", "number")},
            },
        ),
        migrations.CreateModel(
            name="DocumentFromSupplier",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("date", models.DateField()),
                ("number", models.CharField(db_index=True, max_length=50)),
                ("year", models.IntegerField(editable=False)),
            ],
        ),
        migrations.CreateModel(
            name="DocumentToSupplier",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("date", models.DateField()),
                ("number", models.CharField(db_index=True, max_length=50)),
                ("year", models.IntegerField(editable=False)),
            ],
        ),
        migrations.CreateModel(
            name="WarehouseItemsRegistry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("description", models.CharField(max_length=250)),
                (
                    "external_code",
                    models.CharField(
                        blank=True, db_index=True, max_length=50, null=True
                    ),
                ),
                (
                    "internal_code",
                    models.CharField(db_index=True, max_length=50, unique=True),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="WarehouseItems",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "status",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("A", "Available"),
                            ("B", "Booked"),
                            ("E", "Empty"),
                            ("R", "Returned"),
                        ],
                        default=None,
                        max_length=1,
                        null=True,
                    ),
                ),
                ("empty_date", models.DateField(blank=True, db_index=True, null=True)),
                ("batch_code", models.CharField(db_index=True, max_length=100)),
                (
                    "document_customer",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="document_customer",
                        to="core.documentcustomer",
                    ),
                ),
                (
                    "document_from_supplier",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="document_from_supplier",
                        to="core.documentfromsupplier",
                    ),
                ),
                (
                    "document_to_supplier",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="document_to_supplier",
                        to="core.documenttosupplier",
                    ),
                ),
                (
                    "item_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="items_type",
                        to="core.warehouseitemsregistry",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="SupplierRegistry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "external_code",
                    models.CharField(db_index=True, max_length=50, unique=True),
                ),
                ("company_name", models.CharField(max_length=250)),
                ("vat_number", models.CharField(db_index=True, max_length=50)),
            ],
            options={
                "unique_together": {("company_name", "vat_number")},
            },
        ),
        migrations.AddField(
            model_name="documenttosupplier",
            name="supplier",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="core.supplierregistry"
            ),
        ),
        migrations.AddField(
            model_name="documentfromsupplier",
            name="supplier",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="core.supplierregistry"
            ),
        ),
        migrations.AlterUniqueTogether(
            name="documenttosupplier",
            unique_together={("year", "number")},
        ),
        migrations.AlterUniqueTogether(
            name="documentfromsupplier",
            unique_together={("year", "number")},
        ),
    ]

# Generated by Django 4.2.1 on 2023-09-30 21:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0003_warehouseitems_custom_status_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="warehouseitems",
            name="document_customer",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="warehouse_items",
                to="core.documentcustomer",
            ),
        ),
        migrations.AlterField(
            model_name="warehouseitems",
            name="document_from_supplier",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="warehouse_items",
                to="core.documentfromsupplier",
            ),
        ),
        migrations.AlterField(
            model_name="warehouseitems",
            name="document_to_supplier",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="warehouse_items",
                to="core.documenttosupplier",
            ),
        ),
    ]

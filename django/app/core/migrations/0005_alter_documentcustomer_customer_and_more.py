# Generated by Django 4.2.1 on 2023-09-30 21:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_warehouseitems_document_customer_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documentcustomer',
            name='customer',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='document_customer', to='core.customerregistry'),
        ),
        migrations.AlterField(
            model_name='documentfromsupplier',
            name='supplier',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='document_from_supplier', to='core.supplierregistry'),
        ),
        migrations.AlterField(
            model_name='documenttosupplier',
            name='supplier',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='document_to_supplier', to='core.supplierregistry'),
        ),
        migrations.AlterField(
            model_name='warehouseitems',
            name='item_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='warehouse_items', to='core.warehouseitemsregistry'),
        ),
    ]

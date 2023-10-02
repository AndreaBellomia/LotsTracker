import csv
import logging
import json

import mysql.connector as connector

from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from django.utils import timezone as tz


from app.core.models import (
    CustomerRegistry,
    DocumentCustomer,
    WarehouseItems,
    WarehouseItemsRegistry,
)

log = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    def add_arguments(self, parser):
        parser.add_argument(
            "-database", "--d", help="Inset the mysql db Name", type=str
        )
        parser.add_argument(
            "-host",
            "--h",
            required=False,
            default="localhost",
            help="Inset the mysql db Name",
            type=str,
        )

    def handle(self, *args, **options):
        database = options["d"]
        host = options["h"]

        mysql_connection = connector.connect(
            host=host, user="root", password="", database=database
        )
        
        document_errors = []


        log.debug("Connected to mysql database")

        _cursor = mysql_connection.cursor()

        _cursor.execute("SELECT * FROM clienti")
        rows = _cursor.fetchall()

        stat_time = tz.now()
        log.debug("Starting generate customers...")
        for row in rows:
            try:
                _, create = CustomerRegistry.objects.get_or_create(
                    id=row[0], external_code=row[1], company_name=row[2], vat_number=row[3]
                )
            except Exception as e:
                log.warning("duplicate customer: %s, %s, %s", row[0], row[1], row[2])
                document_errors.append(
                    {
                        "Type": "DuplicateKeyCounterpart",
                        "DocumentId": "",
                        "DocumentCode": "",
                        "DocumentData": "",
                        "DocumentSupplierId":"",
                        "TextError": f"duplicate customer: {row[0]}, {row[1]}, {row[2]}",
                        "AticleCode": "",
                        "DocumentDetails": ""
                    }
                )
        
        end_time = (tz.now() - stat_time )
        _cursor.execute("SELECT COUNT(id) FROM clienti")
        count = _cursor.fetchall()
        
        log.debug("Generated %s on %s customers in %s seconds",
            CustomerRegistry.objects.all().count(),
            count[0][0], 
            end_time
        )
        
        log.debug("Starting generate WarehouseItemsRegistry form fixture...")
        with open("app/fixtures/magazzino.csv", newline="") as CSVfile:
            reader = csv.DictReader(CSVfile, delimiter=",")
            for row in reader:
                _, create = WarehouseItemsRegistry.objects.get_or_create(
                    external_code=row["Codice"],
                    internal_code=row["Codice"],
                    description=row["Descrizione"],
                )

        log.debug("Generate all WarehouseItemsRegistry form fixture")
        
        log.debug("Starting generate DocumentCustomer...")
        stat_time = tz.now()
        
        _cursor.execute("SELECT * FROM document")
        rows = _cursor.fetchall()

        
        document_errors = []
        document_errors.append(
            {
                "Type": "",
                "DocumentId": "",
                "DocumentCode": "",
                "DocumentData": "",
                "DocumentSupplierId":"",
                "TextError": "",
                "AticleCode": "",
                "DocumentDetails": ""
            }
        )
        for row in rows:
            try:
                customer = CustomerRegistry.objects.get(pk=row[3])
            except CustomerRegistry.DoesNotExist:
                customer = None
                document_errors.append(
                    {
                        "Type": "CustomerRegistryDoesNotExist",
                        "DocumentId": row[0], 
                        "DocumentCode": row[1], 
                        "DocumentData": row[2], 
                        "DocumentSupplierId": row[3]
                    }
                )

            try:
                document_instance, create = DocumentCustomer.objects.get_or_create(
                    number=row[1],
                    date=tz.datetime.strptime(row[2], "%Y-%m-%d"),
                    customer=customer,
                )

                detail = json.loads(json.loads(row[4]))
                if create:
                    
                    for item in detail["dettaglio"]:
                        item_type, created = WarehouseItemsRegistry.objects.get_or_create(
                            internal_code=item["cod_articolo"],
                            external_code=item["cod_articolo"],
                        )
                        
                        if created:
                            document_errors.append(
                                {
                                    "Type": "WarehouseItemsRegistryDoesNotExist",
                                    "DocumentId": row[0], 
                                    "DocumentCode": row[1], 
                                    "DocumentData": row[2], 
                                    "DocumentSupplierId": row[3],
                                    "TextError": "Item type does not exist in csv file",
                                    "AticleCode": item["cod_articolo"],
                                }
                            )


                        _stato = None
                        if item["stato"] == True:
                            _stato = WarehouseItems.WarehouseItemsStatus.RETURNED

                        _empty_date = None
                        if item["data_rientro"]:
                            _empty_date = tz.datetime.strptime(
                                item["data_rientro"], "%Y-%m-%d"
                            )

                        WarehouseItems.objects.create(
                            empty_date=_empty_date,
                            batch_code=item["matr_atricolo"],
                            item_type=item_type,
                            status=_stato,
                            document_customer=document_instance
                        )

                    if not WarehouseItems.objects.filter(document_customer=document_instance).count() == len(detail["dettaglio"]):
                        document_errors.append(
                            {
                                "Type": "WarehouseItemsError",
                                "DocumentId": row[0], 
                                "DocumentCode": row[1], 
                                "DocumentData": row[2], 
                                "DocumentSupplierId": row[3],
                                "TextError": "Not all detail lines have been loaded",
                                "DocumentDetails": detail["dettaglio"],
                            }
                        )

            except IntegrityError as e:
                if "already exists" in str(e):
                    document_errors.append(
                    {
                        "Type": "DocumentCustomerAlreadyExist",
                        "DocumentId": row[0], 
                        "DocumentCode": row[1], 
                        "DocumentData": row[2], 
                        "DocumentSupplierId": row[3],
                        "TextError": "Document date and code already exist",
                    }
                )
                else:
                  
                    document_errors.append(
                        {
                            "Type": "DocumentCustomerError",
                            "DocumentId": row[0], 
                            "DocumentCode": row[1], 
                            "DocumentData": row[2], 
                            "DocumentSupplierId": row[3],
                            "TextError": "DocumentCustomer not created unknown error",
                        }
                    )

        
        end_time = (tz.now() - stat_time)
        _cursor.execute("SELECT COUNT(id) FROM document")
        count = _cursor.fetchall()
        
        log.debug("Generated generate %s of %s documents in %s seconds", 
            DocumentCustomer.objects.all().count(),
            count[0][0],
            end_time
        )
        
        log.warning("During the procedure there were %s errors", len(document_errors))
        
        
        with open("./erros_dump.csv", mode="w", newline="") as csv_file:
            csv_writer = csv.DictWriter(csv_file, fieldnames=document_errors[0].keys())

            csv_writer.writeheader()

            for row in document_errors:
                csv_writer.writerow(row)
                
            log.warning("Generated dump file error")

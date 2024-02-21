import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "@mui/material";

import FetchApi, { manageFetchError, LottiApi } from "../../libs/axios.js";

import ManageLottForm from "./components/ManageLott.jsx";
import SelectArticleList from "./components/SelectArticleList.jsx";

export default function ManageLott() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formErrors, setFormErrors] = useState({});
    const [formValue, setFormValue] = useState({
        empty_date: null,
        batch_code: "",
        custom_status: "",
        item_type: "",
        document_from_supplier: "",
        document_to_supplier: "",
        document_customer: "",
        status: "",
    });

    const [listModal, setListModal] = useState(false);
    const [articleChoice, setArticleChoice] = useState({});
    const [customerDocument, setCustomerDocument] = useState({
        number: undefined,
        date: undefined,
        id: undefined,
    });
    const [additionalInfo, setAdditionalInfo] = useState({
        customerName: "",
        customerCode: "",
    });

    useEffect(() => {
        if (id) {
            GETapi(id);
        }
    }, [id]);

    useEffect(() => {
        setFormValue({
            ...formValue,
            item_type_id: articleChoice.id,
        });
    }, [articleChoice]);

    // Apis support
    const GETapi = (id) => {
        try {
            new LottiApi().getWarehouseItemsLott(id).then((res) => {
                setFormValue({
                    empty_date: res.data.empty_date,
                    batch_code: res.data.batch_code,
                    custom_status: res.data.custom_status,
                    item_type_id: res.data.item_type.id,
                    item_type_id: res.data.item_type.id,
                    document_from_supplier: "",
                    document_to_supplier: "",
                    document_customer: "",
                    status: res.data.status,
                });

                setArticleChoice(res.data.item_type);

                setCustomerDocument({
                    ...customerDocument,
                    ...res.data.document_customer,
                });
                setAdditionalInfo({
                    customerName: res.data.customer_company_name,
                    customerCode: res.data.customer_company_code,
                });
            });
        } catch (error) {
            console.error(error);
        }
    };

    const POSTapi = () => {
        try {
            new LottiApi()
                .postWarehouseItemsLott(formValue)
                .then((res) => {
                    navigate("/lotti");
                })
                .catch((error) => {
                    if (!error.status === 400) {
                        throw new Error("Error during request: " + error);
                    }
                    manageFetchError(error, formErrors, setFormErrors);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const PUTapi = () => {
        try {
            new LottiApi()
                .putWarehouseItemsLott(id, formValue)
                .then((res) => {
                    navigate("/lotti");
                })
                .catch((error) => {
                    if (!error.status === 400) {
                        throw new Error("Error during request: " + error);
                    }
                    manageFetchError(error, formErrors, setFormErrors);
                    console.log(error);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const saveCommitForm = () => {
        if (id) {
            PUTapi();
        } else {
            POSTapi();
        }
    };

    return (
        <>
            <Container maxWidth="md">
                <ManageLottForm
                    fields={[formValue, setFormValue]}
                    errors={[formErrors, setFormErrors]}
                    article={[articleChoice, setListModal]}
                    customerDocument={[customerDocument, undefined]}
                    additionalInfo={additionalInfo}
                    submit={saveCommitForm}
                />
            </Container>

            <SelectArticleList
                modalState={[listModal, setListModal]}
                tableChoices={setArticleChoice}
            />
        </>
    );
}

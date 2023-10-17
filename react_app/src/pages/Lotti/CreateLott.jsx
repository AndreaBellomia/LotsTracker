import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
} from "@mui/material";

import FetchApi, { manageFetchError } from "../../libs/axios.js";

import CreateLottForm from "../../components/Forms/CreateLott.jsx"
import SelectArticleList from "../../components/Modals/SelectArticleList.jsx"


export default function CreateLott() {
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
    status: ""
  });

  const [listModal, setListModal] = useState(false)
  const [articleChoice, setArticleChoice] = useState({})

  useEffect(() => {
    if (id) {
      GETapi(id);
    }
  }, [id]);

  useEffect(() => {
    setFormValue({
      ...formValue,
      item_type_id: articleChoice.id
    })
  }, [articleChoice]);

  // Apis support
  const GETapi = (id) => {
    try {
      new FetchApi().getWarehouseItemsLott(id).then((res) => {
        setFormValue({
          empty_date: res.data.empty_date,
          batch_code: res.data.batch_code,
          custom_status: res.data.custom_status,
          item_type_id: res.data.item_type.id,
          document_from_supplier: "",
          document_to_supplier: "",
          document_customer: "",
          status: res.data.status
        });

        setArticleChoice(res.data.item_type)
      });
    } catch (error) {
      console.error(error);
    }
  };

  const POSTapi = () => {
    try {
      new FetchApi()
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
      new FetchApi()
        .putWarehouseItemsLott(id, formValue)
        .then((res) => {
          navigate("/lotti");
        })
        .catch((error) => {
          if (!error.status === 400) {
            throw new Error("Error during request: " + error);
          }
          manageFetchError(error, formErrors, setFormErrors);
          console.log(error)
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
        <CreateLottForm 
          fields={[formValue, setFormValue]} 
          errors={[formErrors, setFormErrors]} 
          article={[articleChoice, setListModal]} 
          submit={saveCommitForm}  
          />
      </Container>

      <SelectArticleList modalState={[listModal, setListModal]} tableChoices={setArticleChoice}/>
    </>
  );
}

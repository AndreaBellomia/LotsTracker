import React, { useEffect, useState } from 'react';
import { snack } from '@/components/Snackbar.jsx';

import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';

import { manageFetchError, LottiApi } from '@/libs/axios.js';

import ManageLottForm from './components/ManageLott.jsx';
import SelectArticleList from './components/SelectArticleList.jsx';



function buildPostForm (formValues) {
  const { item_type, document_customer, document_from_supplier, document_to_supplier, ...rest } = formValues;

  const outputObject = { ...rest };

  if (item_type) {
    outputObject.item_type_id = item_type.id;
  }
  if (document_customer) {
    outputObject.document_customer_id = document_customer.id;
  }
  if (document_from_supplier) {
    outputObject.document_from_supplier_id = document_from_supplier.id;
  }
  if (document_to_supplier) {
    outputObject.document_to_supplier_id = document_to_supplier.id;
  }

  return outputObject;
}


export default function ManageLott() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formErrors, setFormErrors] = useState({});
  const [formValue, setFormValue] = useState({
    empty_date: null,
    batch_code: '',
    custom_status: '',
    item_type: '',
    document_from_supplier: '',
    document_to_supplier: '',
    document_customer: '',
    status: '',
  });

  const [listModal, setListModal] = useState(false);

  useEffect(() => {
    if (id) {
      GETapi(id);
    }
  }, [id]);


  // Apis support
  const GETapi = (id) => {
    try {
      new LottiApi().getWarehouseItemsLott(id).then((res) => {
        setFormValue({
          empty_date: res.data.empty_date,
          batch_code: res.data.batch_code,
          custom_status: res.data.custom_status,
          item_type: res.data.item_type,
          document_from_supplier: res.data.document_from_supplier,
          document_to_supplier: res.data.document_to_supplier,
          document_customer: res.data.document_customer,
          status: res.data.status,
        });

      });
    } catch (error) {
      snack.error('Error sconosciuto');
      console.error(error);
    }
  };

  const POSTapi = () => {
    try {
      new LottiApi()
        .postWarehouseItemsLott(formValue)
        .then((res) => {
          navigate('/lotti');
        })
        .catch((error) => {
          if (!error.status === 400) {
            throw new Error('Error during request: ' + error);
          }
          snack.error(error.response.data.detail);
          manageFetchError(error, formErrors, setFormErrors);
        });
    } catch (error) {
      snack.error('Error sconosciuto');
      console.error(error);
    }
  };

  const PUTapi = () => {
    try {
      new LottiApi()
        .putWarehouseItemsLott(id, buildPostForm(formValue))
        .then((res) => {
          navigate('/lotti');
        })
        .catch((error) => {
          if (!error.status === 400) {
            throw new Error('Error during request: ' + error);
          }
          snack.error(error.response.data.detail);
          manageFetchError(error, formErrors, setFormErrors);
        });
    } catch (error) {
      snack.error('Error sconosciuto');
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

  const handlerItemModal = (obj) => {
    setFormValue({
      ...formValue,
      item_type : obj
    })
  }

  return (
    <>
      <Container maxWidth="md">
        <ManageLottForm
          fields={[formValue, setFormValue]}
          errors={[formErrors, setFormErrors]}
          article={setListModal}
          submit={saveCommitForm}
        />
      </Container>

      <SelectArticleList modalState={[listModal, setListModal]} tableChoices={handlerItemModal} />
    </>
  );
}

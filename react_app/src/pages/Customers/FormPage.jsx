import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { Link } from 'react-router-dom';
import { Done } from '@mui/icons-material';
import { FormControl, Grid, FormLabel, Button, Box, Typography } from '@mui/material';
import { manageFetchError, CustomerApi } from '@/libs/axios.js';
import { manageHandlerInput, ManageFormDocument } from '@/libs/forms.js';

import CustomerCard from './components/FormCustomCard.jsx';
import FormTable from './components/FormTable.jsx';
import InputDate from '@/components/forms/InputDate.jsx';
import InputText from '@/components/forms/InputText.jsx';

export default function ManageDocument() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [formValuesCustomer, setFormValuesCustomer] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState({
    body: [],
    customer_id: undefined,
    date: undefined,
    number: undefined,
  });

  const HandlerInput = new manageHandlerInput(formValues, setFormValues, setFormErrors);
  const formManager = new ManageFormDocument(formValues, setFormValues);

  useEffect(() => {
    if (id) {
      GETapi(id);
    }
  }, [id]);

  useEffect(() => {
    setFormValues({
      ...formValues,
      customer_id: formValuesCustomer.id,
    });
  }, [formValuesCustomer]);

  const handlerSnackbar = (msg, variant) => {
    msg && enqueueSnackbar(msg, { variant });
  };

  const handlerSubmit = () => {
    if (id) {
      PUTapi();
    } else {
      POSTapi();
    }
  };

  const GETapi = (id) => {
    try {
      new CustomerApi().getCustomerDocument(id).then((res) => {
        setFormValuesCustomer(res.data.customer);

        setFormValues({
          customer_id: res.data.customer_id,
          date: res.data.date,
          number: res.data.number,
          body: res.data.body,
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const POSTapi = () => {
    try {
      new CustomerApi()
        .postCustomerDocument(formManager.getSubmitForm(formValues))
        .then((res) => {
          navigate('/documenti');
          handlerSnackbar('Documento creato correttamente');
        })
        .catch((error) => {
          if (!error.status === 400) {
            throw new Error('Error during request: ' + error);
          }
          console.log(error);

          manageFetchError(error, formErrors, setFormErrors);
          if (error.response.data.detail) {
            handlerSnackbar(error.response.data.detail, 'error');
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const PUTapi = () => {
    try {
      new CustomerApi()
        .putCustomerDocument(id, formManager.getSubmitForm(formValues))
        .then((res) => {
          navigate('/documenti');
          handlerSnackbar('Documento aggiornato correttamente');
        })
        .catch((error) => {
          if (!error.status === 400) {
            throw new Error('Error during request: ' + error);
          }

          manageFetchError(error, formErrors, setFormErrors);

          if (error.response.data.detail) {
            handlerSnackbar(error.response.data.detail, 'error');
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Typography variant="h4">Documento di consegna</Typography>

      <Box mt={4} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <CustomerCard customerState={[formValuesCustomer, setFormValuesCustomer]} formErrors={formErrors} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Box>
            <FormControl sx={{ width: '100%' }}>
              <FormLabel>Data documento</FormLabel>
              <InputDate value={formValues.date} error={formErrors.date} handler={HandlerInput} />
            </FormControl>
            <FormControl sx={{ width: '100%', mt: 2 }}>
              <FormLabel>Numero documento</FormLabel>
              <InputText name="number" value={formValues.number} error={formErrors.number} handler={HandlerInput} />
            </FormControl>
          </Box>
        </Grid>
      </Grid>

      <Box mt={4} />

      <FormTable
        formValues={formValues.body}
        formErrors={formErrors}
        formManager={formManager}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 4 }}>
        <Link to="/documenti">
          <Button variant="outlined" color="error">
            Annulla
          </Button>
        </Link>

        <Button variant="contained" size="medium" color="grey" onClick={handlerSubmit}>
          <Done />
          <Box mr={1} />
          Salva
        </Button>
      </Box>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

import { Link } from 'react-router-dom';
import { Done } from '@mui/icons-material';
import { FormControl, Grid, FormLabel, TextField, Button, Box, Typography } from '@mui/material';
import { DatePicker } from '@/layout/components';
import { manageFetchError, CustomerApi } from '@/libs/axios.js';
import { manageHandlerInput } from '@/libs/forms.js';
import { ManageFormBodies, getFormBody } from '@/libs/documentFormBody.js';

import SelectItemModal from '@/components/Modals/SelectItem.jsx';
import CustomerCard from './components/FormCustomCard.jsx';
import FormTable from './components/FormTable.jsx';

export default function ManageDocument() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [itemModal, setItemModal] = useState(false);
  const [formValuesBody, setFormValuesBody] = useState([]);
  const [formValuesCustomer, setFormValuesCustomer] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState({
    body: getFormBody(formValuesBody),
    customer_id: undefined,
    date: undefined,
    number: undefined,
  });

  const HandlerInput = new manageHandlerInput(formValues, setFormValues, setFormErrors);
  const formBodies = new ManageFormBodies(formValuesBody, setFormValuesBody);

  useEffect(() => {
    if (id) {
      GETapi(id);
    }
  }, [id]);

  useEffect(() => {
    setFormValues({
      ...formValues,
      body: getFormBody(formValuesBody),
    });
  }, [formValuesBody]);

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
        setFormValuesBody(res.data.body);

        setFormValuesCustomer(res.data.customer);

        setFormValues({
          customer_id: res.data.customer_id,
          date: res.data.date,
          number: res.data.number,
          body: getFormBody(res.data.body),
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const POSTapi = () => {
    try {
      new CustomerApi()
        .postCustomerDocument(formValues)
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
        .putCustomerDocument(id, formValues)
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
              <DatePicker
                onChange={(target) => {
                  HandlerInput.handleInputDatepickerChange(target, 'date');
                }}
                error={Boolean(formErrors.date)}
                helperText={formErrors.date}
                value={formValues.date ? dayjs(formValues.date) : null}
              />
            </FormControl>
            <FormControl sx={{ width: '100%', mt: 2 }}>
              <FormLabel>Numero documento</FormLabel>
              <TextField
                onChange={HandlerInput.handleInputChange}
                name="number"
                value={formValues.number || ''}
                helperText={formErrors.number}
                error={Boolean(formErrors.number)}
              ></TextField>
            </FormControl>
          </Box>
        </Grid>
      </Grid>

      <Box mt={4} />

      <FormTable formValues={formValuesBody} formErrors={formErrors} />

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

      <SelectItemModal modalState={[itemModal, setItemModal]} tableChoices={(item) => formBodies.append(item)} />
    </>
  );
}

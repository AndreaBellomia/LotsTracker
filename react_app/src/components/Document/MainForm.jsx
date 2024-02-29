import React, { useEffect, useState } from 'react';
import { snack } from '@/components/Snackbar.jsx';
import { useNavigate, useParams } from 'react-router-dom';

import { Done, Delete } from '@mui/icons-material';
import { FormControl, Grid, FormLabel, Button, Box, Paper, Typography } from '@mui/material';
import { manageFetchError } from '@/libs/axios.js';
import { manageHandlerInput, ManageFormDocument } from '@/libs/forms.js';

import FormTable from './FormTable.jsx';
import InputDate from '@/components/forms/InputDate.jsx';
import InputText from '@/components/forms/InputText.jsx';
import ConfirmationModal from '@/components/Modals/ConfirmationModal.jsx';

export default function ManageDocument({ counterpartKey, API, CounterpartCard, TableModal }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [confirmModalState, setConfirmModalState] = useState(false);
  const [formCounterpart, setFormCounterpart] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState({
    body: [],
    [`${counterpartKey}_id`]: undefined,
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
      [`${counterpartKey}_id`]: formCounterpart.id,
    });
  }, [formCounterpart]);

  const handlerSubmit = () => {
    if (id) {
      PUTapi();
    } else {
      POSTapi();
    }
  };

  const handlerDelete = () => {
    DELETEapi(id);
  };

  const GETapi = (id) => {
    try {
      new API().getDocument(id).then((res) => {
        if (res.data[counterpartKey]) {
          console.log(res.data)
          setFormCounterpart(res.data[counterpartKey]);
        }

        setFormValues({
          [`${counterpartKey}_id`]: res.data[`${counterpartKey}_id`],
          date: res.data.date,
          number: res.data.number,
          body: res.data.body,
        });


      });
    } catch (error) {
      snack.error('Errore sconosciuto!');
      console.error(error);
    }
  };

  const POSTapi = () => {
    try {
      new API()
        .postDocument(formManager.getSubmitForm(formValues))
        .then((res) => {
          navigate(-1);
          snack.success('Documento creato correttamente');
        })
        .catch((error) => {
          if (!error.status === 400) {
            throw new Error('Error during request: ' + error);
          }

          manageFetchError(error, formErrors, setFormErrors);
          if (error.response.data.detail) {
            snack.error(error.response.data.detail);
          }
        });
    } catch (error) {
      snack.error('Errore sconosciuto!');
      console.error(error);
    }
  };

  const PUTapi = () => {
    console.log(formManager.getSubmitForm(formValues))
    try {
      new API()
        .putDocument(id, formManager.getSubmitForm(formValues))
        .then((res) => {
          navigate(-1);
          snack.success('Documento aggiornato correttamente');
        })
        .catch((error) => {
          if (!error.status === 400) {
            throw new Error('Error during request: ' + error);
          }

          manageFetchError(error, formErrors, setFormErrors);

          if (error.response.data.detail) {
            snack.error(error.response.data.detail);
          }
        });
    } catch (error) {
      snack.error('Errore sconosciuto!');
      console.error(error);
    }
  };

  const DELETEapi = (id) => {
    try {
      new API()
        .deleteDocument(id)
        .then((res) => {
          navigate(-1);
          snack.warning('Il documento é stato eliminato correttamente!');
        })
        .catch((error) => {
          if (!error.status === 400) {
            throw new Error('Error during request: ' + error);
          }

          if (error.response.data.detail) {
            snack.error(error.response.data.detail);
          }
        });
    } catch (error) {
      snack.error('Errore sconosciuto!');
      console.error(error);
    }
  };

  return (
    <>
      <ConfirmationModal modalState={[confirmModalState, setConfirmModalState]} handler={handlerDelete}>
        <Typography variant="subtitle1" color="initial">
          Stai per eliminare il documento, questa azione è irreversibile!
        </Typography>
      </ConfirmationModal>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <CounterpartCard state={[formCounterpart, setFormCounterpart]} formErrors={formErrors} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Paper elevation={5} sx={{ p: 2 }}>
            <Box>
              <FormControl sx={{ width: '100%' }}>
                <FormLabel>Data documento</FormLabel>
                <InputDate value={formValues.date} error={formErrors.date} handler={HandlerInput} />
              </FormControl>
              <FormControl sx={{ width: '100%', mt: 2 }}>
                <FormLabel>Numero documento</FormLabel>
                <InputText
                  name="number"
                  value={formValues.number}
                  error={formErrors.number}
                  handler={HandlerInput.handleInputChange}
                />
              </FormControl>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box mt={4} />

      <Paper elevation={5}>
        <FormTable formValues={formValues.body} formErrors={formErrors} formManager={formManager} Modal={TableModal} />
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 4 }}>
        <Button variant="outlined" color="error" onClick={() => navigate(-1)}>
          Annulla
        </Button>

        <Box sx={{ display: 'flex' }}>
          {id && (
            <Button
              variant="contained"
              size="medium"
              color="error"
              onClick={() => setConfirmModalState(true)}
              sx={{ mr: 2 }}
            >
              <Delete />
              <Box mr={1} />
              Elimina
            </Button>
          )}

          <Button variant="contained" size="medium" color="grey" onClick={handlerSubmit}>
            <Done />
            <Box mr={1} />
            Salva
          </Button>
        </Box>
      </Box>
    </>
  );
}

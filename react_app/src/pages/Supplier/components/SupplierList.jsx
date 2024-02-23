import React, { useEffect, useState } from 'react';
import { snack } from '@/components/Snackbar.jsx';

import { manageFetchError, SupplierApi } from '@/libs/axios.js';
import { Button, IconButton, Box, Modal, TextField, FormControl, FormLabel, Grid, Typography } from '@mui/material';
import ModalBox from '@/layout/components/ModalBox.jsx';
import { manageHandlerInput } from '@/libs/forms.js';

import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

export default function CustomerList({ modalStatus: modalStatus, fetchId: fetchId }) {
  /* State */
  const [open, setOpen] = modalStatus;
  const [id, seId] = fetchId;
  const handleClose = () => {
    setOpen(false);
    seId(undefined), HandlerInput.clearForm();
  };

  const [formValues, setFormValues] = useState({
    id: '',
    company_name: '',
    vat_number: '',
    external_code: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const HandlerInput = new manageHandlerInput(formValues, setFormValues, setFormErrors);

  useEffect(() => {
    if (id) {
      GETapi(id);
    }
  }, [id]);

  /* Fetch API */
  const GETapi = (id) => {
    try {
      new SupplierApi().getSupplier(id).then((res) => {
        setFormValues({ ...res.data });
      });
    } catch (error) {
      snack.error('Error sconosciuto');
      console.error(error);
    }
  };

  const POSTapi = () => {
    try {
      new SupplierApi()
        .postSupplier(formValues)
        .then((response) => {
          setOpen(false);
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
      new SupplierApi()
        .putSupplier(id, formValues)
        .then((_) => {
          handleClose();
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

  return (
    <>
      <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <ModalBox>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              {id ? `Modifica articolo ${formValues.internal_code}` : 'Crea nuovo articolo'}
            </Typography>
            <IconButton onClick={handleClose} color="error">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box my={2} />

          <FormControl sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormLabel>Nome Cliente</FormLabel>
                <TextField
                  name="company_name"
                  onChange={HandlerInput.handleInputChange}
                  value={formValues.company_name}
                  helperText={formErrors.company_name || formErrors.non_field_errors}
                  error={Boolean(formErrors.company_name || formErrors.non_field_errors)}
                ></TextField>
              </Grid>
            </Grid>

            <Box mt={3} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormLabel>PIVA</FormLabel>
                <TextField
                  name="vat_number"
                  value={formValues.vat_number}
                  onChange={HandlerInput.handleInputChange}
                  helperText={formErrors.vat_number || formErrors.non_field_errors}
                  error={Boolean(formErrors.vat_number || formErrors.non_field_errors)}
                ></TextField>
              </Grid>

              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormLabel>Codice Esterno</FormLabel>
                <TextField
                  name="external_code"
                  value={formValues.external_code}
                  onChange={HandlerInput.handleInputChange}
                  helperText={formErrors.external_code}
                  error={Boolean(formErrors.external_code)}
                ></TextField>
              </Grid>
            </Grid>

            <Box my={2} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => handleClose()} variant="outlined" color="error">
                Annulla
              </Button>

              <Button onClick={() => saveCommitForm()} variant="contained" color="grey">
                {id ? <>salva</> : <>conferma</>}
              </Button>
            </Box>
          </FormControl>
        </ModalBox>
      </Modal>
    </>
  );
}

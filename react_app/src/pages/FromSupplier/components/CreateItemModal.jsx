import React, { useEffect, useState } from 'react';
import { snack } from '@/components/Snackbar.jsx';

import { Modal, Typography, Box, Button, FormControl, Grid, FormLabel, TextField, Autocomplete } from '@mui/material';
import ModalBox from '@/layout/components/ModalBox.jsx';
import InputText from '@/components/forms/InputText.jsx';

import { ItemsTypeApi } from '@/libs/axios.js';

export default function ArticlesListModal({ modalState: modaleState, tableChoices: tableChoices }) {
  const [open, setOpen] = modaleState;

  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFromValues] = useState({
    item_type: null,
  });

  const [itemTypes, setItemTypes] = useState([]);

  const submitSelect = () => {
    if (formValues.item_type === null || formValues.item_type === undefined) {
      setFormErrors({
        item_type: 'Il valore inserito non é valido',
      });
      return;
    }
    if (formValues.batch_code === null || formValues.batch_code === undefined) {
      setFormErrors({
        batch_code: 'Il valore inserito non é valido',
      });
      return;
    }

    tableChoices(formValues);
    setFormErrors({});
    setFromValues({
      ...formValues,
      batch_code: undefined,
    });
    snack.info(`Lotto ${formValues.batch_code} aggiunto al documento`);
  };

  const handlerClose = () => {
    setFromValues({
      item_type: null,
    });
    setFormErrors({});
    setOpen(false);
  };
  const handlerInput = (e) => {
    const { name, value } = e.target;
    setFromValues({
      ...formValues,
      [name]: value,
    });
  };

  const handlerAutocomplete = (e, value) => {
    setFromValues({
      ...formValues,
      item_type: value,
    });
  };

  useEffect(() => {
    if (open) {
      GETapi();
    }
  }, [open]);

  const GETapi = (id) => {
    try {
      new ItemsTypeApi().getItemsList().then((res) => {
        setItemTypes([...res.data]);
      });
    } catch (error) {
      snack.error('Error sconosciuto');
      console.error(error);
    }
  };

  return (
    <>
      <Modal keepMounted open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <ModalBox
          sx={{
            width: '700px !important',
            position: 'relative',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 3,
            overflow: 'hidden',
          }}
        >
          <Typography variant="h4" color="initial">
            Crea lotto
          </Typography>

          <Box sx={{ my: 2 }} />

          <FormControl sx={{ width: '100%' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormLabel>Lotto</FormLabel>
                <InputText
                  name="batch_code"
                  value={formValues.batch_code}
                  error={formErrors.batch_code}
                  handler={handlerInput}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormLabel>Articolo</FormLabel>
                <Autocomplete
                  value={formValues.item_type}
                  onChange={handlerAutocomplete}
                  name="item_type"
                  options={itemTypes}
                  getOptionLabel={(option) => `${option.internal_code} | ${option.description}`}
                  renderInput={(params) => <TextField {...params} />}
                />
                {formErrors.item_type && (
                  <Typography sx={{ ml: 2 }} variant="caption" color="error">
                    {formErrors.item_type}
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Box my={2} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handlerClose} variant="outlined" color="error">
                Chiudi
              </Button>

              <Button onClick={submitSelect} variant="contained" color="grey">
                Aggiungi
              </Button>
            </Box>
          </FormControl>
        </ModalBox>
      </Modal>
    </>
  );
}

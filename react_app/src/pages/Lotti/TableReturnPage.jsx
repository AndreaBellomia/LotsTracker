import React, { useState } from 'react';
import { snack } from '@/components/Snackbar.jsx';

import {
  Box,
  Paper, Typography, Button
} from '@mui/material';

import TableItemsComponent from './components/TableReturn.jsx';
import ReturnTableForm from './components/ReturnTableForm.jsx';

import { manageFetchError, ItemsApi } from '@/libs/axios.js';

function getFromValue(formValue) {
  return {
    ...formValue,
    body : formValue.body.map(item => ({ id: item.id }))
  }
}

export default function () {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFromValues] = useState({
    body : []
  });

  const POSTapi = () => {
    try {
      new ItemsApi()
        .postItemsReturnLists(getFromValue(formValues))
        .then((res) => {
          snack.success("Elementi rientrati correttamente");
          setFromValues({
            body : []
          })
        })
        .catch((error) => {
          if (!error.status === 400) {
            throw new Error('Error during request: ' + error);
          }
          console.log(error)
          snack.error(error.response.data.detail);
          manageFetchError(error, formErrors, setFormErrors);
        });
    } catch (error) {
      snack.error('Error sconosciuto');
      console.error(error);
    }
  };


  return (
    <>
      <Paper elevation={5}>
        <Box sx={{ p: '1rem', display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" color="initial">Lotti da rientrare</Typography>
            <Typography variant="subtitle" color="text.secondary" fontWeight={600}>Totale giorni: {formValues.body.reduce((acc, current) => acc + current.days_left, 0)} giorni/o</Typography>
          </Box>
          <Button variant="contained" size="medium" color="grey" onClick={POSTapi}>Rientra</Button>
        </Box>
      <ReturnTableForm formState={[formValues, setFromValues]} formErrors={formErrors}/>
      </Paper>

      <Box mt={4} />

      <TableItemsComponent addModalOpen={handleOpen} key={open} formState={[formValues, setFromValues]} />
    </>
  );
}

import React, { useState } from 'react';
import { snack } from '@/components/Snackbar.jsx';

import {
  Box,
  Paper, Typography, Button
} from '@mui/material';

import TableItemsComponent from './components/TableReturn.jsx';
import ReturnTableForm from './components/ReturnTableForm.jsx';

function getFromValue(formValue) {
  return {
    ...formValue,
    body : formValue.body.map(item => ({ id: item.id }))
  }
}

export default function () {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const [fromErrors, setFormErrors] = useState({});
  const [formValues, setFromValues] = useState({
    body : []
  });

  const POSTapi = () => {
    console.log(getFromValue(formValues))
    // try {
    //   new LottiApi()
    //     .postWarehouseItemsLott(formValue)
    //     .then((res) => {
    //       navigate('/lotti');
    //     })
    //     .catch((error) => {
    //       if (!error.status === 400) {
    //         throw new Error('Error during request: ' + error);
    //       }
    //       snack.error(error.response.data.detail);
    //       manageFetchError(error, formErrors, setFormErrors);
    //     });
    // } catch (error) {
    //   snack.error('Error sconosciuto');
    //   console.error(error);
    // }
  };


  return (
    <>
      <Paper elevation={5}>
        <Box sx={{ p: '1rem', display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" color="initial">Lotti da rientrare</Typography>
          <Button variant="contained" size="medium" color="grey" onClick={POSTapi}>Rientra</Button>
        </Box>
      <ReturnTableForm formState={[formValues, setFromValues]} formErrors={fromErrors}/>
      </Paper>

      <Box mt={4} />

      <TableItemsComponent addModalOpen={handleOpen} key={open} formState={[formValues, setFromValues]} />
    </>
  );
}

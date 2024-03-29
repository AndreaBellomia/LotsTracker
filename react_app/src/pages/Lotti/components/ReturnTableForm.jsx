import React, { useState } from 'react';

import { RemoveCircle, AddCircle, Done } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import {
  Typography,
  Paper,
  IconButton,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Tooltip,
  Box
} from '@mui/material';

const CustomTableRow = styled(TableRow)(({ theme, sx }) => ({
  '&:last-child td, &:last-child th': { border: 0 },

  ...sx,
}));

function generateTableRow(row, index, errors, handler) {
  const id = row.id;

  const error = errors && errors.find((obj) => parseInt(obj.id) === id);

  const sxError = error
    ? {
        border: 1,
        borderColor: 'red',
        borderStyle: 'solid',
        backgroundColor: '#ffa896',

        '&:hover': {
          backgroundColor: '#e0897b',
        },
      }
    : {};

  return (
    <Tooltip title={(error && error.message) || ''} key={index} followCursor>
      <CustomTableRow sx={{ ...sxError }}>
        <TableCell component="th" scope="row">
          {row.batch_code}
        </TableCell>
        <TableCell align="right">
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" sx={{ mb: 0.3 }}>
            {row.item_type.description}
          </Typography>
          <Typography variant="subtitle2" color="text.disabled" fontWeight="600">
            {row.item_type.internal_code}
          </Typography>
        </Box>
        </TableCell>
        <TableCell align="right">{row.days_left}</TableCell>
        <TableCell align="right">
          <IconButton onClick={() => handler(id)}>
            <RemoveCircle color="error" />
          </IconButton>
        </TableCell>
      </CustomTableRow>
    </Tooltip>
  );
}

export default function ({ formState, formErrors }) {
  const [formValues, setFormValues] = formState;

  const handlerRemoveItem = (item) => {
    console.log();
    setFormValues({
      body: formValues.body.filter((e) => e.id !== item),
    });
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ height: 350, overflowY: 'auto' }}>
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Lotto</TableCell>
              <TableCell align="right">Articolo</TableCell>
              <TableCell align="right">Giorni dalla consegna</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formValues.body && (
              formValues.body.map((row, index) => generateTableRow(row, index, formErrors.body, handlerRemoveItem))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

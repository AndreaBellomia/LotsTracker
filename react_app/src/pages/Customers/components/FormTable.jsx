import React from 'react';

import { RemoveCircle, AddCircle, Done } from '@mui/icons-material';

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
} from '@mui/material';

export default function ({ formValues, formErrors, modalButton }) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Descrizione</TableCell>
              <TableCell align="right">Codice</TableCell>
              <TableCell align="right">Lotto</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formValues &&
              formValues.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.item_type.description}
                  </TableCell>
                  <TableCell align="right">{row.item_type.internal_code}</TableCell>
                  <TableCell align="right">{row.batch_code}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => formBodies.remove(row.id)}>
                      <RemoveCircle color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            <TableRow
              sx={{
                '&:last-child td, &:last-child th': {
                  border: 0,
                  textAlign: 'center',
                },
              }}
            >
              <TableCell colSpan={4} align="right">
                <IconButton onClick={() => modalButton(true)}>
                  <AddCircle color="grey" />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {formErrors.body &&
        formErrors.body.map((error) => (
          <Typography variant="body2" color="error" key={error.id}>
            {error.message}
          </Typography>
        ))}
    </>
  );
}

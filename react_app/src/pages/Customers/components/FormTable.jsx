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
} from '@mui/material';

import SelectItemModal from '@/components/Modals/SelectItem.jsx';

const CustomTableRow = styled(TableRow)(({ theme, sx }) => ({
  '&:last-child td, &:last-child th': { border: 0 },

  ...sx,
}));

function generateTableRow(row, index, errors, formManager) {
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
          {row.item_type.description}
        </TableCell>
        <TableCell align="right">{row.item_type.internal_code}</TableCell>
        <TableCell align="right">{row.batch_code}</TableCell>
        <TableCell align="right">
          <IconButton onClick={() => formManager.remove(id)}>
            <RemoveCircle color="error" />
          </IconButton>
        </TableCell>
      </CustomTableRow>
    </Tooltip>
  );
}

export default function ({ formValues, formErrors, formManager }) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <SelectItemModal modalState={[modal, setModal]} tableChoices={(item) => formManager.append(item)} />

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
            {formValues && formValues.map((row, index) => generateTableRow(row, index, formErrors.body, formManager))}
            <TableRow
              sx={{
                '&:last-child td, &:last-child th': {
                  border: 0,
                  textAlign: 'center',
                },
              }}
            >
              <TableCell colSpan={4} align="right">
                <IconButton onClick={() => setModal(true)}>
                  <AddCircle color="grey" />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

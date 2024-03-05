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
  Box,
} from '@mui/material';

const CustomTableRow = styled(TableRow)(({ theme, sx }) => ({
  '&:last-child td, &:last-child th': { border: 0 },
  ...sx,
}));

const CustomHeaderTableRow = styled(TableRow)(({ theme, sx }) => ({
  backgroundColor: '#e8eaeb',
  '&:hover': {
    backgroundColor: '#e8eaeb',
  },
}));

function generateBodyRow(row, index, errors, formManager) {
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
        <TableCell align="right"></TableCell>
        <TableCell align="right">
          <Typography variant="body2" fontWeight={600}>
            {row.batch_code}{' '}
          </Typography>
        </TableCell>
        <TableCell align="right">
          {row.id ? (
            <IconButton onClick={() => formManager.remove(row.id)}>
              <RemoveCircle color="error" />
            </IconButton>
          ) : (
            <IconButton onClick={() => formManager.removeBatchCode(row.batch_code)}>
              <RemoveCircle color="error" />
            </IconButton>
          )}
        </TableCell>
      </CustomTableRow>
    </Tooltip>
  );
}

function generateTableRow(row, index, errors, formManager) {
  const header = (
    <CustomHeaderTableRow key={index}>
      <TableCell component="th" scope="row" colSpan={2}>
      {row.internal_code}
      <Typography variant="body1" fontWeight={600}>
        {row.description}
      </Typography>
      </TableCell>
      <TableCell component="th" scope="row"></TableCell>
    </CustomHeaderTableRow>
  );

  const bodies =
    row.body &&
    row.body.map((item, iIndex) => {
      const indx = `${index}_${iIndex}`;
      return generateBodyRow(item, indx, errors, formManager);
    });

  return [header, ...bodies];
}

export default function ({ formValues, formErrors, formManager, Modal }) {
  const [modal, setModal] = useState(false);

  const formBody = [];

  formValues.forEach((element, index) => {
    const itemTypeIds = formBody.map((value) => value.id);

    if (itemTypeIds.includes(element.item_type.id)) {
      const itemType = formBody.find((e) => e.id === element.item_type.id);
      itemType.body = [...itemType.body, element];
    } else {
      formBody.push({
        ...element.item_type,
        body: [{ batch_code: element.batch_code, id: element.id }],
      });
    }
  });

  return (
    <>
      <Modal modalState={[modal, setModal]} tableChoices={(item) => formManager.append(item)} />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Descrizione</TableCell>
              <TableCell align="right">Lotto</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formBody && formBody.map((row, index) => generateTableRow(row, index, formErrors.body, formManager))}
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

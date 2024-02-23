import React from 'react';

import { Box, Typography, Container } from '@mui/material';

import { ToSupplierApiDocument } from '@/libs/axios.js';

import SelectItemModal from './components/SelectItem.jsx';
import FormSupplierCard from '@/components/forms/FormSupplierCard.jsx';
import MainForm from '@/components/Document/MainForm.jsx';

export default function ManageDocument() {
  return (
    <>
      <Container>
        <Typography variant="h4">Reso a fornitore</Typography>

        <Box mt={4} />

        <MainForm
          counterpartKey="supplier"
          API={ToSupplierApiDocument}
          CounterpartCard={FormSupplierCard}
          TableModal={SelectItemModal}
        />
      </Container>
    </>
  );
}

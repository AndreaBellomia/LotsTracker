import React from 'react';

import { Box, Typography, Container } from '@mui/material';
import { FromSupplierApiDocument } from '@/libs/axios.js';

import SupplierCard from '@/components/forms/FormSupplierCard.jsx';
import CreateItemModal from './components/CreateItemModal.jsx';

import MainForm from '@/components/Document/MainForm.jsx';

export default function ManageDocument() {
  return (
    <>
      <Container>
        <Typography variant="h4">Carico magazzino</Typography>

        <Box mt={4} />

        <MainForm
          counterpartKey="supplier"
          API={FromSupplierApiDocument}
          CounterpartCard={SupplierCard}
          TableModal={CreateItemModal}
        />
      </Container>
    </>
  );
}

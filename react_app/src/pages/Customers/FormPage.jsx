import React from 'react';

import { Box, Typography } from '@mui/material';

import { CustomerApiDocument } from '@/libs/axios.js';

import SelectItemModal from './components/SelectItem.jsx';
import MainForm from '@/components/Document/MainForm.jsx';

import CustomerCard from './components/FormCustomCard.jsx';

export default function ManageDocument() {
  return (
    <>
      <Typography variant="h4">Documento di consegna</Typography>

      <Box mt={4} />

      <MainForm
        counterpartKey="customer"
        API={CustomerApiDocument}
        CounterpartCard={CustomerCard}
        TableModal={SelectItemModal}
      />
    </>
  );
}

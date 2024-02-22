import React from 'react';

import { Box, Typography } from '@mui/material';

import { CustomerApi } from '@/libs/axios.js';

import SelectItemModal from '@/components/Modals/SelectItem.jsx';
import MainForm from '@/components/Document/MainForm.jsx';

import CustomerCard from './components/FormCustomCard.jsx';

export default function ManageDocument() {
  return (
    <>
      <Typography variant="h4">Documento di consegna</Typography>

      <Box mt={4} />

      <MainForm
        counterpartKey="customer"
        API={CustomerApi}
        CounterpartCard={CustomerCard}
        TableModal={SelectItemModal}
      />
    </>
  );
}

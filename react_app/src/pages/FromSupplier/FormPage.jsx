import React from 'react';

import { Box, Typography } from '@mui/material';
import { FromSupplierApi } from '@/libs/axios.js';


import SupplierCard from '../../components/forms/FormSupplierCard.jsx';
import CreateItemModal from './components/CreateItemModal.jsx';


import MainForm from '@/components/Document/MainForm.jsx'

export default function ManageDocument() {


  return (
    <>
      <Typography variant="h4">Carico magazzino</Typography>

      <Box mt={4} />

      <MainForm counterpartKey="supplier" API={FromSupplierApi} CounterpartCard={SupplierCard} TableModal={CreateItemModal} />
    </>
  );
}

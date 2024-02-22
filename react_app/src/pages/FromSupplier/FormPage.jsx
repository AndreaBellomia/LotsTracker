import React, { useEffect, useState } from 'react';

import { FormControl, Grid, FormLabel, Button, Box, Typography } from '@mui/material';
import { SupplierApi } from '@/libs/axios.js';


import SupplierCard from './components/FormSupplierCard.jsx';
import CreateItemModal from './components/CreateItemModal.jsx';


import MainForm from '@/components/Document/MainForm.jsx'

export default function ManageDocument() {


  return (
    <>
      <MainForm counterpartKey="supplier" API={SupplierApi} CounterpartCard={SupplierCard} TableModal={CreateItemModal} />
    </>
  );
}

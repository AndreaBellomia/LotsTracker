import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import DocumentCustomerTable from './components/MainTableList.js';
import { Grid,  Box, Button } from '@mui/material';

import CustomerMainTableList from './components/CustomerMainTableList.jsx';

import FromSupplierMainTableList from './components/FromSupplierMainTableList.jsx';
import ToSupplierMainTableList from './components/ToSupplierMainTableList.jsx';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function _({ type }) {
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
          <Button variant="contained" color={type === 'customer' ? "primary" : "grey" } onClick={() => navigate('/documenti/lista/consegna')} sx={{ width: "100%" }}>
            Documenti di consegna
          </Button>
        </Grid>
        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
        <Button variant="contained" color={type === 'fromSupplier' ? "primary" : "grey" }  onClick={() => navigate('/documenti/lista/carico')} sx={{ width: "100%" }}>
            Documenti di carico{' '}
          </Button>
        </Grid>
        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
        <Button variant="contained" color={type === 'toSupplier' ? "primary" : "grey" } onClick={() => navigate('/documenti/lista/scarico')} sx={{ width: "100%" }}>
            Documenti di reso
          </Button>
        </Grid>
      </Grid>
        <Box sx={{ p: 2 }} />

        {type === 'customer' && <CustomerMainTableList />}
        {type === 'fromSupplier' && <FromSupplierMainTableList />}
        {type === 'toSupplier' && <ToSupplierMainTableList />}
      </Box>
    </>
  );
}

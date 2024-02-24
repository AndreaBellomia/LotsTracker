import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import DocumentCustomerTable from './components/MainTableList.js';
import { Tabs, Tab, Box, TabContext, Typography } from '@mui/material';


import CustomerMainTableList from "./components/CustomerMainTableList.jsx"

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
      {value === index && (
        children
      )}
    </div>
  );
}

export default function _() {
  const { page } = useParams();
  const navigate = useNavigate();
  // const basePath = useBasePath();
  const [value, setValue] = useState(Number(page) || 0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const currentPath = location.pathname.split(`/${page}`)[0];
    navigate(`${currentPath}/${value}`)
  }, [value, navigate]);

  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          aria-label="full width tabs example"
        >
          <Tab label="Documenti di consegna"  />
          <Tab label="Documenti di carico"  />
          <Tab label="Documenti di reso" />
        </Tabs>
        <Box sx={{ p:2 }} />

        <CustomTabPanel value={value} index={0}>
          <CustomerMainTableList/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <FromSupplierMainTableList/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ToSupplierMainTableList/>
        </CustomTabPanel>
      </Box>
    </>
  );
}

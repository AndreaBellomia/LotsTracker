import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';

import {
  ChevronRight,
  Person,
  Settings,
  FolderRounded,
  WidgetsRounded,
  QrCodeScannerRounded,
  FactoryRounded,
  JoinFullRounded,
  LocalShippingRounded,
  FileUploadRounded
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

import BigIconButton from '@/components/BigIconButton.jsx'
import DocumentsCustomerTables from '@/pages/Documents/components/CustomerMainTableList.jsx'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={10}>
          <DocumentsCustomerTables minima={true} />
        </Grid>

        <Grid item xs={12} md={4} lg={2}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <BigIconButton onClick={() => navigate(`/lotti/riconsegna`)} IconProps={JoinFullRounded}/>
            </Grid>
            <Grid item xs={6}>
              <BigIconButton onClick={() => navigate(`/documenti/scarico/crea`)} IconProps={FolderRounded}/>
            </Grid>
            <Grid item xs={6}>
              <BigIconButton onClick={() => navigate(`/magazzino`)} IconProps={WidgetsRounded}/>
            </Grid>
            <Grid item xs={6}>
              <BigIconButton onClick={() => navigate(`/clienti`)} IconProps={Person}/>
            </Grid>
          </Grid>
        </Grid>

        {/* <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}></Paper>
        </Grid> */}
      </Grid>
    </>
  );
}

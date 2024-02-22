import React, { useState } from 'react';

import { Edit } from '@mui/icons-material';
import { Box, Typography, Paper, IconButton } from '@mui/material';

import SelectCustomerModal from './SelectCustomerModal.jsx';

export default function ({ state: state, formErrors: formErrors }) {
  const [modal, setModal] = useState(false);
  const [value, setter] = state;
  return (
    <>
      <SelectCustomerModal modalState={[modal, setModal]} tableChoices={(item) => setter(item)} />
      <Paper
        elevation={5}
        direction="row"
        sx={{
          p: 2,
          border: formErrors.customer_id ? '1px solid #FF5630' : 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5">Cliente</Typography>
          <IconButton
            onClick={() => {
              setModal(true);
            }}
            color="primary"
          >
            <Edit />
          </IconButton>
        </Box>

        <Box>
          <Typography variant="p" color="text.secondary">
            {value.company_name || '--'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {value.vat_number || '--'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {value.external_code || '--'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </>
  );
}

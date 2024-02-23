import React, { useState } from 'react';
import SelectSupplierModal from '@/components/Modals/SelectSupplierModal.jsx';

import { Edit } from '@mui/icons-material';
import { Box, Typography, Paper, IconButton } from '@mui/material';

export default function ({ state: state, formErrors: formErrors }) {
  const [modal, setModal] = useState(false);
  const [value, setter] = state;

  return (
    <>
      <SelectSupplierModal modalState={[modal, setModal]} tableChoices={(item) => setter(item)} />
      <Paper
        elevation={5}
        direction="row"
        sx={{
          p: 2,
          border: formErrors.supplier_id ? '1px solid #FF5630' : 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: "space-between"
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5">Fornitore</Typography>
            <IconButton
              onClick={() => {
                setModal(true);
              }}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Box>
          <Typography variant="p" color="text.secondary">
            {value.company_name || '--'}
          </Typography>
        </Box>

        <Box>
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

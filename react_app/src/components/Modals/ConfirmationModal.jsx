import React, { useEffect, useState } from 'react';

import { Modal, Typography, Box, Button, Alert } from '@mui/material';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';

import ModalBox from '@/layout/components/ModalBox.jsx';

export default function ArticlesListModal({ modalState: modaleState, handler: handler, children: children }) {
  const [open, setOpen] = modaleState;

  const submitSelect = () => {
    handler();
    setOpen(false);
  };

  return (
    <>
      <Modal keepMounted open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <ModalBox
          sx={{
            width: '600px !important',
            position: 'relative',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 0,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 3 }}>
            <Alert icon={<PriorityHighRoundedIcon fontSize="inherit" />} severity="warning">
              <Typography variant="h6" color="warning">
                Attenzione
              </Typography>
            </Alert>

            <Box sx={{ mt: 3 }} />

            {children}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant="contained" color="grey" onClick={() => setOpen(false)}>
                Chiudi
              </Button>

              <Button variant="contained" color="warning" onClick={submitSelect}>
                Conferma
              </Button>
            </Box>
          </Box>
        </ModalBox>
      </Modal>
    </>
  );
}

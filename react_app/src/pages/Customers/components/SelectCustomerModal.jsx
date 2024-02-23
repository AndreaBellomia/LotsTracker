import React, { useEffect, useState } from 'react';
import { snack } from '@/components/Snackbar.jsx';

import {
  Modal,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
  Pagination,
} from '@mui/material';
import ModalBox from '@/layout/components/ModalBox.jsx';
import InputSearch from '@/components/InputSearch.jsx';

import { CustomerApi } from '@/libs/axios.js';

export default function ArticlesListModal({ modalState: modaleState, tableChoices: tableChoices }) {
  const [open, setOpen] = modaleState;

  const [search, setSearch] = useState('');
  const [pages, setPages] = useState(1);
  const [pageSelected, setPageSelected] = useState(1);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    try {
      new CustomerApi().getCustomersList(pageSelected, search, ' ').then((response) => {
        setTableData(response.data.results);
        setPages(response.data.num_pages);
      });
    } catch (error) {
      snack.error('Error sconosciuto');
      console.error(error);
    }
  }, [pageSelected, search]);

  const submitSelect = (obj) => {
    tableChoices(obj);
    setOpen(false);
  };

  return (
    <>
      <Modal keepMounted open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <ModalBox
          sx={{
            width: '700px !important',
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 0,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 3 }}>
            <InputSearch setterValue={setSearch} />
          </Box>
          <TableContainer sx={{ height: 650 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableBody>
                {tableData.map((obj, index) => (
                  <TableRow key={index}>
                    <TableCell onClick={() => submitSelect(obj)}>
                      <Box>
                        <Typography variant="body1">{obj.company_name ? obj.company_name : '--'}</Typography>
                        <Typography variant="body2" color="text.disabled" fontWeight="bold">
                          {obj.external_code}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => submitSelect(obj)} sx={{ textAlign: 'end' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {obj.vat_number ? obj.vat_number : '--'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Pagination
              count={Number(pages)}
              color="grey"
              shape="rounded"
              onChange={(e, page) => {
                setPageSelected(page);
              }}
            />
            <Button variant="contained" color="grey" onClick={() => setOpen(false)}>
              Chiudi
            </Button>
          </Box>
        </ModalBox>
      </Modal>
    </>
  );
}

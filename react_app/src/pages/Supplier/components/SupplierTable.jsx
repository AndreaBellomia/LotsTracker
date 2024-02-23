import React, { useEffect, useState } from 'react';
import { snack } from '@/components/Snackbar.jsx';

import { useNavigate } from 'react-router-dom';
import { Paper, Grid, Button, Box, Pagination, IconButton } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import { SupplierApi } from '@/libs/axios';
import InputSearch from '@/components/InputSearch.jsx';
import Tables, { TableHeaderMixin, TableRowsMixin } from '@/components/Tables.jsx';

export default function ({ addModalOpen, addModalId }) {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [search, setSearch] = useState('');
  const [pageSelected, setPageSelected] = useState(1);

  const [pages, setPages] = useState('');

  useEffect(() => {
    try {
      new SupplierApi().getSuppliersList(pageSelected, search, orderBy).then((response) => {
        setTableData(response.data.results);
        setPages(response.data.num_pages);
      });
    } catch (error) {
      snack.error('Error sconosciuto');
      console.error(error);
    }
  }, [pageSelected, orderBy, search]);

  const headers = [
    new TableHeaderMixin({
      key: 'external_code',
      label: 'Codice',
      orderable: true,
    }),
    new TableHeaderMixin({
      key: 'company_name',
      label: 'Anagrafica',
      align: 'right',
      orderable: true,
    }),
    new TableHeaderMixin({
      key: 'vat_number',
      label: 'P.IVA',
      align: 'right',
      orderable: true,
    }),
    new TableHeaderMixin({ key: 'id', label: '', align: 'right' }),
  ];

  const bodis = new TableRowsMixin(tableData, {
    id: (value) => (
      <IconButton
        onClick={() => {
          addModalId(value);
          addModalOpen();
        }}
        color="primary"
      >
        <EditIcon />
      </IconButton>
    ),
  });

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6} md={6} lg={6}></Grid>
        <Grid item xs={5} md={6} lg={6}>
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button variant="contained" size="medium" color="grey" onClick={() => addModalOpen()}>
              <AddIcon />
              <Box mr={1} />
              Aggiungi
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={5}>
            <Grid container>
              <Grid item xs={6} md={4} lg={4}>
                <Box sx={{ p: '1rem' }}>
                  <InputSearch setterValue={setSearch} />
                </Box>
              </Grid>
            </Grid>
            <Tables headers={headers} bodis={bodis} orderBy={[orderBy, setOrderBy]}></Tables>

            {Number(pages) > 1 && (
              <Box sx={{ p: '1rem', display: 'flex', justifyContent: 'end' }}>
                <Pagination
                  count={Number(pages)}
                  color="grey"
                  shape="rounded"
                  onChange={(e, page) => {
                    setPageSelected(page);
                  }}
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

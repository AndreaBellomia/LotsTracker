import React, { useEffect, useState } from 'react';
import { snack } from '@/components/Snackbar.jsx';

import { Paper, Grid, Button, Box, Typography, Chip, Pagination, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import { CustomerApiDocument } from '@/libs/axios.js';
import InputSearch from '@/components/InputSearch.jsx';
import Tables, { TableHeaderMixin, TableRowsMixin } from '@/components/Tables.jsx';

function renderStatus(status) {
  switch (status) {
    case 'Open':
      return <Chip label="Aperto" color="success" />;
    case 'Partial':
      return <Chip label="Parziale" color="warning" />;
    case 'Closed':
      return <Chip label="Chiuso" color="info" />;
    default:
      return <Chip label="Error" color="error" />;
  }
}

export default function ({ minima }) {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [search, setSearch] = useState('');
  const [pageSelected, setPageSelected] = useState(1);

  const [pages, setPages] = useState('');

  useEffect(() => {
    try {
      new CustomerApiDocument().getDocumentsList(pageSelected, search, orderBy).then((response) => {
        setTableData(response.data.results);
        setPages(response.data.num_pages);
      });
    } catch (error) {
      snack.error('Error sconosciuto');
      console.error(error);
    }
  }, [pageSelected, orderBy, search]);

  const headers = [
    new TableHeaderMixin({ key: 'id', label: '', orderable: !minima }),
    new TableHeaderMixin({ key: 'number', label: 'Numero', align: 'right', orderable: !minima }),
    new TableHeaderMixin({
      key: 'counterpart',
      label: 'Cliente',
      align: 'right',
      orderable: !minima,
    }),
    new TableHeaderMixin({ key: 'date', label: 'Data', align: 'right', orderable: !minima }),
    new TableHeaderMixin({ key: 'year', label: 'Anno', align: 'right', orderable: !minima }),
    new TableHeaderMixin({ key: 'status', label: 'Stato', align: 'right', orderable: !minima }),
  ];

  const bodis = new TableRowsMixin(tableData, {
    id: (value) => (
      <IconButton
        onClick={() => {
          navigate(`/documenti/modifica/${value}`);
        }}
        color="primary"
      >
        <EditIcon />
      </IconButton>
    ),
    status: (value) => renderStatus(value),
  });

  return (
    <>
      {minima ? (
        <Paper elevation={5}>
          <Tables headers={headers} bodis={bodis} orderBy={[orderBy, setOrderBy]}></Tables>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, alignItems: 'center' }}>
            <Typography variant="h4" color="initial">
              Documenti di consegna
            </Typography>
            <Link to="/documenti/crea">
              <Button variant="contained" size="medium" color="grey">
                <AddIcon />
                <Box mr={1} />
                Aggiungi
              </Button>
            </Link>
          </Box>
          <Paper elevation={5}>
            <Grid container>
              <Grid item xs={6} md={4} lg={4}>
                <Box sx={{ p: 2 }}>
                  <InputSearch setterValue={setSearch} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Tables headers={headers} bodis={bodis} orderBy={[orderBy, setOrderBy]}></Tables>
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { snack } from '@/components/Snackbar.jsx';

import { Paper, Grid, Button, Box, Typography, Pagination, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import { FromSupplierApiDocument } from '@/libs/axios.js';
import InputSearch from '@/components/InputSearch.jsx';
import Tables, { TableHeaderMixin, TableRowsMixin } from '@/components/Tables.jsx';

// function renderStatus(status) {
//   switch (status) {
//     case 'Open':
//       return <Chip label="Aperto" color="success" />;
//     case 'Partial':
//       return <Chip label="Parziale" color="warning"/>;
//     case 'Closed':
//       return <Chip label="Chiuso" color="info"/>;
//     default:
//       return <Chip label="Error" color="error"/>;
//   }
// }

export default function () {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [search, setSearch] = useState('');
  const [pageSelected, setPageSelected] = useState(1);

  const [pages, setPages] = useState('');

  useEffect(() => {
    try {
      new FromSupplierApiDocument().getDocumentsList(pageSelected, search, orderBy).then((response) => {
        setTableData(response.data.results);
        setPages(response.data.num_pages);
      });
    } catch (error) {
      snack.error('Error sconosciuto');
      console.error(error);
    }
  }, [pageSelected, orderBy, search]);

  const headers = [
    new TableHeaderMixin({ key: 'id', label: '', orderable: true }),
    new TableHeaderMixin({ key: 'number', label: 'Numero', align: 'right', orderable: true }),
    new TableHeaderMixin({
      key: 'counterpart',
      label: 'Fornitore',
      align: 'right',
      orderable: true,
    }),
    new TableHeaderMixin({ key: 'date', label: 'Data', align: 'right', orderable: true }),
    new TableHeaderMixin({ key: 'year', label: 'Anno', align: 'right', orderable: true }),
    // new TableHeaderMixin({ key: 'status', label: 'Stato', align: 'right', orderable: true }),
  ];

  const bodis = new TableRowsMixin(tableData, {
    id: (value) => (
      <IconButton
        onClick={() => {
          navigate(`modifica/${value}`);
        }}
        color="primary"
      >
        <EditIcon />
      </IconButton>
    ),
    // status: (value) => renderStatus(value),
  });

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, alignItems: "center" }}>
        <Typography variant="h4" color="initial">Documenti di carico</Typography>
        <Link to="/fornitori/documenti/carico/crea">
          <Button variant="contained" size="medium" color="grey">
            <AddIcon />
            <Box mr={1} />
            Aggiungi
          </Button>
        </Link>
      </Box>
      <Paper elevation={5}>
        <Grid container>
          <Box sx={{ p: 2 }}>
            <InputSearch setterValue={setSearch} />
          </Box>
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
  );
}

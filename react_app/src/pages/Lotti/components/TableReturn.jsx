import React, { useEffect, useState } from 'react';
import { snack } from '@/components/Snackbar.jsx';

import { Link, useNavigate } from 'react-router-dom';
import { Paper, Grid, Button, Box, Stack, Chip, Pagination, Typography, IconButton, Checkbox } from '@mui/material';

import { ItemsApi } from '@/libs/axios.js';
import InputSearch from '@/components/InputSearch.jsx';
import Tables, { TableHeaderMixin, TableRowsMixin } from '@/components/Tables.jsx';
import AddIcon from '@mui/icons-material/Add';

function renderDays(days) {
  if (days < 30) {
    return <Chip label={days} color="success" sx={{ width: '100%' }} />;
  } else if (days < 60) {
    return <Chip label={days} color="info" sx={{ width: '100%' }} />;
  } else if (days < 100) {
    return <Chip label={days} color="warning" sx={{ width: '100%' }} />;
  } else {
    return <Chip label={days} color="error" sx={{ width: '100%' }} />;
  }
}

function renderItemType(value, render) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle1" sx={{ mb: 0.3 }}>
        {value.description}
      </Typography>
      <Typography variant="subtitle2" color="text.disabled" fontWeight="600">
        {value.internal_code}
      </Typography>
    </Box>
  );
}

function renderCustomer(value, render) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle1" sx={{ mb: 0.3 }}>
        {value && value.counterpart}
      </Typography>
      <Typography variant="subtitle2" color="text.disabled" fontWeight="600">
        {value && value.counterpart_code}
      </Typography>
    </Box>
  );
}

export default function TableComponent({ formState }) {
  const [tableData, setTableData] = useState([]);
  const [orderBy, setOrderBy] = useState('-days_left');
  const [search, setSearch] = useState('');
  const [pageSelected, setPageSelected] = useState(1);
  const [pages, setPages] = useState('');

  const [formValues, setFormValues] = formState;

  const headers = [
    new TableHeaderMixin({
      key: 'batch_code',
      label: 'Lotto',
      orderable: true,
      sxTh: { maxWidth: '5rem' },
    }),
    new TableHeaderMixin({ key: 'item_type', label: 'Articolo' }),
    new TableHeaderMixin({ key: 'document_customer', label: 'Cliente', align: 'right' }),
    new TableHeaderMixin({
      key: 'date',
      label: 'Data consegna',
      orderable: true,
      align: 'center',
      accessor: 'document_customer__date',
      sxTh: { width: '10%' },
    }),
    new TableHeaderMixin({
      key: 'days_left',
      label: 'Giorni',
      orderable: true,
      align: 'right',
      sxTh: { width: '10%' },
    }),
    new TableHeaderMixin({ key: 'id', label: '', align: 'center', sxTh: { width: '3rem' } }),
  ];

  function handlerFormBody(event, value) {
    if (event.target.checked && !formValues.body.some((obj) => obj.id === value.id)) {
      setFormValues({
        body: [...formValues.body, value],
      });
    } else {
      setFormValues({
        body: formValues.body.filter((e) => e.id !== value.id),
      });
    }
  }

  function checkItemInForm(value) {
    if (formValues.body.some((obj) => obj.id === value)) {
      return true;
    }
    return false;
  }

  const bodis = new TableRowsMixin(tableData, {
    batch_code: (value) => (
      <Typography variant="subtitle1" fontWeight="600">
        {value}
      </Typography>
    ),
    days_left: (value) => renderDays(value),
    item_type: (value, render) => renderItemType(value, render),
    document_customer: (value, render) => renderCustomer(value, render),
    date: (value, render) => (
      <Typography variant="subtitle1" fontWeight="600">
        {value ? new Date(value).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '--'}
      </Typography>
    ),
    id: (value, render) => {
      return (
        <Checkbox
          checked={checkItemInForm(value)}
          onChange={(event) => handlerFormBody(event, render)}
          color="default"
        />
      );
    },
  });

  useEffect(() => {
    try {
      new ItemsApi().getItemsReturnLists(pageSelected, search, orderBy).then((response) => {
        setTableData(response.data.results);
        setPages(response.data.num_pages);
      });
    } catch (error) {
      snack.error('Error sconosciuto');
      console.error(error);
    }
  }, [pageSelected, orderBy, search]);

  return (
    <>
      <Grid container spacing={3}>
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
          </Paper>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </>
  );
}

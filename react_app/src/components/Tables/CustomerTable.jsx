import React, { useEffect, useState } from 'react';
import {
    Link,
    Paper,
    Grid,
    Button,
    Box,
    Stack,
    Chip,
    Pagination
} from "@mui/material";

import FetchApi from "../../libs/axios"
import InputSearch from "../InputSearch.jsx"
import Tables, { TableHeaderMixin, TableRowsMixin } from "../Tables.jsx"


export default function TableComponent({ addModalOpen }) {

    const [tableData, setTableData] = useState([]);
    const [orderBy, setOrderBy] = useState("")
    const [search, setSearch] = useState("")
    const [pageSelected, setPageSelected] = useState(1);

    const [pages, setPages] = useState("") 
  
  
    useEffect(() => {
      try {
        new FetchApi().getCustomer(pageSelected, search, orderBy).then(response => {
            console.log(response.data)
            setTableData(response.data.results)
            setPages(response.data.num_pages)
        })
        
      } catch (error) { 
        console.log("error")
      }
    }, [pageSelected, orderBy, search]);


  
    const headers = [
      new TableHeaderMixin({key:"external_code", label:"Codice", orderable:true}),
      new TableHeaderMixin({key:"company_name", label:"Anagrafica", align:"right", orderable:true}),
      new TableHeaderMixin({key:"vat_number", label:"P.IVA", align:"right", orderable:true}),
      new TableHeaderMixin({key:"vat_number_due", label:"P.IVA", align:"right", orderable:true, accessor:"vat_number"}),
      new TableHeaderMixin({key:"detail_url", label:"", align:"right"}),
    ]
  
    const bodis = new TableRowsMixin(tableData, {
        detail_url: (value, render) => <Chip label="Modifica" color="primary" variant="outlined" onClick={() => console.log(value, render)} />,
    })
  
    return (
      <>                        
        <Grid container spacing={3}>
          <Grid item xs={6} md={4} lg={4}>
            <InputSearch setterValue={setSearch} />
          </Grid>
          <Grid item xs={1} md={4} lg={4}>
          </Grid>
          <Grid item xs={5} md={4} lg={4}>
            <Box sx={{ display: 'flex', justifyContent:"end" }}>
            <Stack spacing={2} direction="row">
                <Button variant="contained" size="medium" color="secondary" onClick={() => addModalOpen()}>Aggiungi</Button>
            </Stack>
      
            </Box> 
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={5}>
              <Tables headers={headers} bodis={bodis} orderBy={[orderBy, setOrderBy]}></Tables>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box mt="2" />

            <Pagination count={Number(pages)} color="primary" onChange={(e, page) => {setPageSelected(page)}} />
          </Grid>
        </Grid>
      </>
    );
  }
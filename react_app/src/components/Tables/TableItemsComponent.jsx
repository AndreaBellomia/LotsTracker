import React, { useEffect, useState } from 'react';
import {
    Link,
    Paper,
    Grid,
    Button,
    Box,
    Stack,
    Chip,
    Pagination,
    Typography
} from "@mui/material";

import BlurCircularIcon from '@mui/icons-material/BlurCircular';

import FetchApi from "../../libs/axios"
import InputSearch from "../InputSearch.jsx"
import Tables, { TableHeaderMixin, TableRowsMixin } from "../Tables.jsx"


function renderStatus(status) {
    switch (status) {
        case "A":
            return <Chip label="Disponibile" color="success"/>;
        case "B":
            return <Chip label="Venduta" color="warning"/>;
        case "E":
            return <Chip label="Vuoto" color="info" />;
        case "R":
            return <Chip label="Restituito" color="secondary" />;
        default:
            return <Chip label="Error" color="error" />;
    }
}

function renderItemType(value, render) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="subtitle1" sx={{ mb:.5 }}>{value}</Typography>
      <Typography variant="subtitle2" color="text.disabled" fontWeight="600">{render.item_type_description}</Typography>
    </Box>
  )
}

function renderCustomer(value, render) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="subtitle1" sx={{ mb:.5 }}>{value}</Typography>
      <Typography variant="subtitle2" color="text.disabled" fontWeight="600">{render.customer_company_code}</Typography>
    </Box>
  )
}




export default function TableComponent({ addModalOpen }) {

    const [tableData, setTableData] = useState([]);
    const [orderBy, setOrderBy] = useState("")
    const [search, setSearch] = useState("")
    const [pageSelected, setPageSelected] = useState(1);
    const [pages, setPages] = useState("") 


    const headers = [
      new TableHeaderMixin({key:"batch_code", label:"Lotto", orderable:true, sxTh:{maxWidth: "5rem" }}),
      new TableHeaderMixin({key:"item_type_code", label:"Articolo"}),
      new TableHeaderMixin({key:"customer_company_name", label:"Cliente", align:"right"}),
      new TableHeaderMixin({key:"status", label:"Stato", orderable:true, align:"right", sxTh:{width:"10%"}}),
      new TableHeaderMixin({key:"id", label:"", align:"center", sxTh:{width:"3rem"}}),
    ]
  
    const bodis = new TableRowsMixin(tableData, {
      batch_code: (value) => <Typography variant="subtitle1" fontWeight="600">{value}</Typography>,
        status: (value) => renderStatus(value),
        item_type_code: (value, render) => renderItemType(value, render),
        customer_company_name: (value, render) => renderCustomer(value, render),
        id: (value) => <Button onClick={(value) => console.log(value)}><BlurCircularIcon/></Button>
    })
  
  
  
    useEffect(() => {
      try {
        new FetchApi().getWarehouseItemDetail(pageSelected, search, orderBy).then(response => {
            setTableData(response.data.results)
            setPages(response.data.num_pages)
        })
        
      } catch (error) { 
        console.log("error")
      }
    }, [pageSelected, orderBy, search]);


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
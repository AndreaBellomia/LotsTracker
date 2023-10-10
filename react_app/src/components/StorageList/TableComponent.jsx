import React, { useEffect, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
    Link,
    Paper,
    Grid,
    Button,
    Box,
    Stack,
    Chip
} from "@mui/material";

import FetchApi from "../../libs/axios"
import InputSearch from "../InputSearch.jsx"
import Tables, { TableHeaderMixin, TableRowsMixin } from "../Tables.jsx"



export default function Dashboard() {

    const [tableData, setTableData] = useState([]);
    const [orderBy, setOrderBy] = useState("")
    const [search, setSearch] = useState("")
  
  
    useEffect(() => {
      try {
        new FetchApi().getWarehouseItems(search, orderBy).then(res => setTableData(res))
      } catch (error) { 
        console.log("error")
      }
    }, [orderBy, search]);

  
    const headers = [
      new TableHeaderMixin({key:"internal_code", label:"Codice", orderable:true}),
      new TableHeaderMixin({key:"description", label:"Descrizione", orderable:true, align:"right"}),
      new TableHeaderMixin({key:"external_code", label:"Codice Esterno", orderable:true, align:"right"}),
      new TableHeaderMixin({key:"detail_url", label:"", orderable:false, align:"center"}),
    ]
  
    const bodis = new TableRowsMixin(tableData, {
      detail_url: (value) => <Chip label="Modifica" color="primary" variant="outlined" onClick={() => console.log("cioa")} />
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
                <Button variant="contained" size="medium" color="secondary">Aggiungi</Button>
                <Button variant="contained" size="medium" color="secondary">esporta</Button>
            </Stack>
      
            </Box> 
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={5}>
              <Tables headers={headers} bodis={bodis} orderBy={[orderBy, setOrderBy]}></Tables>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }
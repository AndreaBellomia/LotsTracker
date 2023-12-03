import React, { useEffect, useState } from "react";
import { Paper, Grid, Button, Box, Stack, Chip, Pagination } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";

import FetchApi from "../../libs/axios";
import InputSearch from "../InputSearch.jsx";
import Tables, { TableHeaderMixin, TableRowsMixin } from "../Tables.jsx";

function renderStatus(status) {
    switch (status) {
        case "Open":
            return <Chip label="Aperto" color="info" variant="outlined" />;
        case "Partial":
            return <Chip label="Parziale" color="warning" variant="outlined" />;
        case "Closed":
            return <Chip label="Chiuso" color="success" variant="outlined" />;
        default:
            return <Chip label="Error" color="error" variant="outlined" />;
    }
}

export default function TableComponent({ addModalOpen }) {
    const [tableData, setTableData] = useState([]);
    const [orderBy, setOrderBy] = useState("");
    const [search, setSearch] = useState("");
    const [pageSelected, setPageSelected] = useState(1);

    const [pages, setPages] = useState("");

    useEffect(() => {
        try {
            new FetchApi().getCustomerDocuments(pageSelected, search, orderBy).then((response) => {
                setTableData(response.data.results);
                setPages(response.data.num_pages);
            });
        } catch (error) {
            console.log("error");
        }
    }, [pageSelected, orderBy, search]);

    const headers = [
        new TableHeaderMixin({ key: "detail_url", label: "", orderable: true }),
        new TableHeaderMixin({ key: "number", label: "Numero", align: "right", orderable: true }),
        new TableHeaderMixin({
            key: "customer",
            label: "Cliente",
            align: "right",
            orderable: true,
        }),
        new TableHeaderMixin({ key: "date", label: "Data", align: "right", orderable: true }),
        new TableHeaderMixin({ key: "year", label: "Anno", align: "right", orderable: true }),
        new TableHeaderMixin({ key: "status", label: "Stato", align: "right", orderable: true }),
    ];

    const bodis = new TableRowsMixin(tableData, {
        detail_url: (value) => (
            <Chip
                label="Modifica"
                color="primary"
                variant="outlined"
                onClick={() => console.log("cioa")}
            />
        ),
        status: (value) => renderStatus(value),
    });

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={6} md={4} lg={4}>
                    <InputSearch setterValue={setSearch} />
                </Grid>
                <Grid item xs={1} md={4} lg={4}></Grid>
                <Grid item xs={5} md={4} lg={4}>
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Link to="/documenti/crea">
                            <Button variant="contained" size="medium" color="grey">
                                <AddIcon />
                                <Box mr={1} />
                                Aggiungi
                            </Button>
                        </Link>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={5}>
                        <Tables
                            headers={headers}
                            bodis={bodis}
                            orderBy={[orderBy, setOrderBy]}
                        ></Tables>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Box mt="2" />

                    <Pagination
                        count={Number(pages)}
                        color="primary"
                        onChange={(e, page) => {
                            setPageSelected(page);
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
}

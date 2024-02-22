import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Paper,
    Grid,
    Button,
    Box,
    Stack,
    Chip,
    Pagination,
    Typography,
    IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import { ItemsApi } from "@/libs/axios.js";
import InputSearch from "@/components/InputSearch.jsx";
import Tables, { TableHeaderMixin, TableRowsMixin } from "@/components/Tables.jsx";
import AddIcon from "@mui/icons-material/Add";

function renderStatus(status) {
    switch (status) {
        case "A":
            return <Chip label="Disponibile" color="success" sx={{ width: "100%" }} />;
        case "B":
            return <Chip label="Venduta" color="warning" sx={{ width: "100%" }} />;
        case "E":
            return <Chip label="Vuoto" color="info" sx={{ width: "100%" }} />;
        case "R":
            return <Chip label="Restituito" color="secondary" sx={{ width: "100%" }} />;
        default:
            return <Chip label="Error" color="error" sx={{ width: "100%" }} />;
    }
}

function renderItemType(value, render) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
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
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" sx={{ mb: 0.3 }}>
                {value}
            </Typography>
            <Typography variant="subtitle2" color="text.disabled" fontWeight="600">
                {render.customer_company_code}
            </Typography>
        </Box>
    );
}

export default function TableComponent() {
    const navigate = useNavigate();

    const [tableData, setTableData] = useState([]);
    const [orderBy, setOrderBy] = useState("");
    const [search, setSearch] = useState("");
    const [pageSelected, setPageSelected] = useState(1);
    const [pages, setPages] = useState("");

    const headers = [
        new TableHeaderMixin({
            key: "batch_code",
            label: "Lotto",
            orderable: true,
            sxTh: { maxWidth: "5rem" },
        }),
        new TableHeaderMixin({ key: "item_type", label: "Articolo" }),
        new TableHeaderMixin({ key: "customer_company_name", label: "Cliente", align: "right" }),
        new TableHeaderMixin({
            key: "status",
            label: "Stato",
            orderable: true,
            align: "right",
            sxTh: { width: "10%" },
        }),
        new TableHeaderMixin({ key: "id", label: "", align: "center", sxTh: { width: "3rem" } }),
    ];

    const bodis = new TableRowsMixin(tableData, {
        batch_code: (value) => (
            <Typography variant="subtitle1" fontWeight="600">
                {value}
            </Typography>
        ),
        status: (value) => renderStatus(value),
        item_type: (value, render) => renderItemType(value, render),
        customer_company_name: (value, render) => renderCustomer(value, render),
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
    });

    useEffect(() => {
        try {
            new ItemsApi()
                .getWarehouseItemsList(pageSelected, search, orderBy)
                .then((response) => {
                    setTableData(response.data.results);
                    setPages(response.data.num_pages);
                });
        } catch (error) {
            console.error(error);
        }
    }, [pageSelected, orderBy, search]);

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={6} md={6} lg={6}></Grid>
                <Grid item xs={5} md={6} lg={6}>
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Link to="/lotti/crea">
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
                        <Grid container>
                            <Grid item xs={6} md={4} lg={4}>
                                <Box sx={{ p: "1rem" }}>
                                    <InputSearch setterValue={setSearch} />
                                </Box>
                            </Grid>
                        </Grid>
                        <Tables
                            headers={headers}
                            bodis={bodis}
                            orderBy={[orderBy, setOrderBy]}
                        ></Tables>

                        <Box sx={{ p: "1rem", display: "flex", justifyContent: "end" }}>
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

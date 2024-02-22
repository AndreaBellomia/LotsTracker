import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Paper, Grid, Button, Box, Stack, Chip, Pagination, IconButton } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import CustomerApi from "@/libs/axios";
import InputSearch from "@/components/InputSearch.jsx";
import Tables, { TableHeaderMixin, TableRowsMixin } from "../Tables.jsx";

export default function TableComponent({ addModalOpen, addModalId }) {
    const navigate = useNavigate();

    const [tableData, setTableData] = useState([]);
    const [orderBy, setOrderBy] = useState("");
    const [search, setSearch] = useState("");
    const [pageSelected, setPageSelected] = useState(1);

    const [pages, setPages] = useState("");

    useEffect(() => {
        try {
            new CustomerApi().getCustomersList(pageSelected, search, orderBy).then((response) => {
                setTableData(response.data.results);
                setPages(response.data.num_pages);
            });
        } catch (error) {
            console.log("error");
        }
    }, [pageSelected, orderBy, search]);

    const headers = [
        new TableHeaderMixin({
            key: "external_code",
            label: "Codice",
            orderable: true,
        }),
        new TableHeaderMixin({
            key: "company_name",
            label: "Anagrafica",
            align: "right",
            orderable: true,
        }),
        new TableHeaderMixin({
            key: "vat_number",
            label: "P.IVA",
            align: "right",
            orderable: true,
        }),
        new TableHeaderMixin({ key: "id", label: "", align: "right" }),
    ];

    const bodis = new TableRowsMixin(tableData, {
        // detail_url: (value, render) => <Chip label="Modifica" color="primary" variant="outlined" onClick={() => console.log(value, render)} />,
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
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Button
                            variant="contained"
                            size="medium"
                            color="grey"
                            onClick={() => addModalOpen()}
                        >
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

                        {Number(pages) > 1 && (
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
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

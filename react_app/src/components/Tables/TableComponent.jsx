import React, { useEffect, useState } from "react";
import { Link, Paper, Grid, Button, Box, Stack, Chip, Typography, IconButton } from "@mui/material";

import FetchApi from "../../libs/axios";
import InputSearch from "../InputSearch.jsx";
import Tables, { TableHeaderMixin, TableRowsMixin } from "../Tables.jsx";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

function renderCode(value, render) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" sx={{ mb: 0.5 }}>
                {value}
            </Typography>
            <Typography variant="caption" color="text.disabled" fontWeight="600">
                {render.external_code}
            </Typography>
        </Box>
    );
}

export default function TableComponent({ addModalOpen, addModalId }) {
    const [tableData, setTableData] = useState([]);
    const [orderBy, setOrderBy] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        try {
            new FetchApi()
                .getWarehouseItems(search, orderBy)
                .then((response) => setTableData(response.data));
        } catch (error) {
            console.log("error");
        }
    }, [orderBy, search]);

    const headers = [
        new TableHeaderMixin({
            key: "internal_code",
            label: "Codice",
            orderable: true,
        }),
        new TableHeaderMixin({
            key: "description",
            label: "Descrizione",
            orderable: true,
            align: "right",
        }),
        new TableHeaderMixin({
            key: "available_count",
            label: "Magazzino",
            orderable: true,
            align: "right",
            sxTh: { width: "1rem" },
        }),
        new TableHeaderMixin({
            key: "id",
            label: "",
            orderable: false,
            align: "right",
            sxTh: { width: "3rem" },
        }),
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
        internal_code: (value, render) => renderCode(value, render),
        description: (value, render) => <Typography variant="body1">{value}</Typography>,
        available_count: (value, render) => <Typography variant="body1">{value}</Typography>,
    });

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6} md={6} lg={6} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h5" fontWeight="600">
                        Articoli di magazzino
                    </Typography>
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Stack spacing={2} direction="row">
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
                        </Stack>
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
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

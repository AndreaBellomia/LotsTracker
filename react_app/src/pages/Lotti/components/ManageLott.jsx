import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
import {
    FormControl,
    Grid,
    FormLabel,
    TextField,
    Button,
    Box,
    Typography,
    Divider,
    Paper,
    IconButton,
    MenuItem,
} from "@mui/material";

import { AssignmentReturnedOutlined, Sell, Edit, Output } from "@mui/icons-material";

import { DatePicker, ButtonDocumentBig } from "../../../layout/components/index.js";
import { manageHandlerInput } from "../../../libs/forms.js";

const statusChoices = [
    { label: "--", value: "" },
    { label: "Disponibile", value: "A" },
    { label: "Venduto", value: "B" },
    { label: "Vuoto", value: "E" },
    { label: "Ritornato F.", value: "R" },
];

export default function CreateLottForm({
    fields: fields,
    errors: errors,
    article: article,
    customerDocument: customerDocument,
    additionalInfo: additionalInfo,
    submit: submit,
}) {
    const { id } = useParams();

    const [formValue, setFormValue] = fields;
    const [formErrors, setFormErrors] = errors;
    const [articleChoice, articleModal] = article;
    const [customerDocumentChoice, customerDocumentModal] = customerDocument;
    const submitForm = submit;
    const HandlerInput = new manageHandlerInput(formValue, setFormValue, setFormErrors);

    const handleInputDatepickerChange = (e) => {
        const date = e.$d;
        setFormValue({
            ...formValue,
            empty_date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        });
        setFormErrors({});
    };

    return (
        <>
            <Typography variant="h3">{id ? "Modifica Lotto" : "Crea un Lotto"}</Typography>
            <Divider sx={{ my: 3 }} />
            <FormControl sx={{ width: "100%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8} lg={6}>
                        <Paper
                            elevation={5}
                            direction="row"
                            sx={{
                                p: 2,
                                border: formErrors.item_type_id ? "1px solid #FF5630" : "none",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="h5">Articolo</Typography>
                                <IconButton
                                    onClick={() => {
                                        articleModal(true);
                                    }}
                                    color="primary"
                                >
                                    <Edit />
                                </IconButton>
                            </Box>

                            <Box>
                                <Typography variant="p" color="text.secondary">
                                    {articleChoice.description || "--"}
                                </Typography>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {articleChoice.internal_code || "--"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {articleChoice.external_code || "--"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    {id ? (
                        <Grid item xs={12} md={8} lg={6}>
                            <Paper
                                elevation={5}
                                direction="row"
                                sx={{
                                    p: 2,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="h5">Cliente</Typography>

                                <Typography variant="p" color="text.secondary">
                                    {additionalInfo.customerName || "--"}
                                </Typography>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {additionalInfo.customerCode || "--"}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ) : (
                        <></>
                    )}
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Paper elevation={5} direction="row" sx={{ p: 2 }}>
                    <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="h5" gutterBottom>
                            Dettaglio
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sx={{ display: "flex", flexDirection: "column" }}>
                                <FormLabel>Data di restituzione</FormLabel>
                                <DatePicker
                                    onChange={(target) => {
                                        HandlerInput.handleInputDatepickerChange(
                                            target,
                                            "empty_date"
                                        );
                                    }}
                                    error={Boolean(formErrors.empty_date)}
                                    helperText={formErrors.empty_date}
                                    value={dayjs(formValue.empty_date)}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ display: "flex", flexDirection: "column" }}>
                                <FormLabel>Numero Lotto</FormLabel>
                                <TextField
                                    onChange={HandlerInput.handleInputChange}
                                    name="batch_code"
                                    value={formValue.batch_code}
                                    helperText={formErrors.batch_code}
                                    error={Boolean(formErrors.batch_code)}
                                ></TextField>
                            </Grid>
                            <Grid item xs={6} sx={{ display: "flex", flexDirection: "column" }}>
                                <FormLabel>Stato manuale</FormLabel>
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    value={formValue.status || ""}
                                    helperText="Questo campo viene aggiornato automaticamente"
                                >
                                    {statusChoices.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                            onClick={() => {
                                                setFormValue({
                                                    ...formValue,
                                                    status: option.value,
                                                });
                                            }}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>

                <Box mt={3} />
                {id ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
                                    <ButtonDocumentBig
                                        icon={AssignmentReturnedOutlined}
                                        description="-- del --"
                                        title="documento d'ingresso"
                                    />
                                </Grid>
                                <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
                                    <ButtonDocumentBig
                                        icon={Sell}
                                        description={`${
                                            customerDocumentChoice.number ?? "--"
                                        } del ${customerDocumentChoice.date ?? "--"}`}
                                        onClick={() => {
                                            console.log(customerDocumentChoice.id ?? "--");
                                        }}
                                        title="Documento di vendita"
                                    />
                                </Grid>
                                <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
                                    <ButtonDocumentBig
                                        icon={Output}
                                        description="-- del --"
                                        title="documento d'uscita"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                ) : (
                    <></>
                )}

                <Box my={2} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Link to="/lotti">
                        <Button variant="outlined" color="error">
                            Annulla
                        </Button>
                    </Link>

                    <Button
                        onClick={() => {
                            submitForm();
                        }}
                        variant="contained"
                        color="grey"
                    >
                        conferma
                    </Button>
                </Box>
            </FormControl>
        </>
    );
}

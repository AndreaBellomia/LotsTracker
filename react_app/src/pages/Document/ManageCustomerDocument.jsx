import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import {
    FormControl,
    Grid,
    FormLabel,
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    IconButton,
    TableContainer,
    TableHead,
    TableRow,
    Table,
    TableBody,
    TableCell,
} from "@mui/material";
import { DatePicker, ButtonDocumentBig } from "../../layout/components";
import { manageHandlerInput } from "../../libs/forms.js";

import { RemoveCircle, AddCircle, Edit, Done } from "@mui/icons-material";

import FetchApi, { manageFetchError } from "../../libs/axios.js";

import SelectItemModal from "../../components/Modals/SelectItem.jsx";
import SelectCustomerModal from "../../components/Modals/SelectCustomerModal.jsx";

import { useSnackbar } from "notistack";


class ManageFormBodies {
    constructor(body, setBody, itemCode, batchCode) {
        this.body = body;
        this.setBody = setBody;
    }

    append(item) {
        if (!this.body.some((existingItem) => existingItem.id === item.id)) {
            this.setBody([...this.body, item]);
        }
    }

    remove(id) {
        const updatedValues = this.body.filter((item) => item.id !== id);
        this.setBody(updatedValues);
    }
}

function getFormBody(formBody) {
    return formBody.map((item) => Object({ id: item.id }));
}

export default function ManageDocument() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [itemModal, setItemModal] = useState(false);
    const [customerModal, setCustomerModal] = useState(false);
    const [formValuesBody, setFormValuesBody] = useState([]);
    const [formValuesCustomer, setFormValuesCustomer] = useState({});

    const [formValues, setFormValues] = useState({
        body: getFormBody(formValuesBody),
        customer_id: undefined,
        date: undefined,
        number: undefined,
    });
    const [formErrors, setFormErrors] = useState({});
    const HandlerInput = new manageHandlerInput(formValues, setFormValues, setFormErrors);
    const formBodies = new ManageFormBodies(formValuesBody, setFormValuesBody);

    useEffect(() => {
        setFormValues({
            ...formValues,
            body: getFormBody(formValuesBody),
        });
    }, [formValuesBody]);

    useEffect(() => {
        setFormValues({
            ...formValues,
            customer_id: formValuesCustomer.id,
        });
    }, [formValuesCustomer]);

    const POSTapi = () => {
        console.log(formValues);
        try {
            new FetchApi()
                .postCustomerDocument(formValues)
                .then((res) => {
                    navigate("/documenti");
                    handleClickVariant("Documento creato correttamente", "success");
                })
                .catch((error) => {
                    handleClickVariant(
                        error.response.data.detail || "Error durante la creazione del documento!",
                        "error"
                    );
                    if (!error.status === 400) {
                        throw new Error("Error during request: " + error);
                    }
                    if (!error.status === undefined) {
                        navigate("/documenti");
                    }
                    manageFetchError(error, formErrors, setFormErrors);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const handleClickVariant = (msg, variant) => () => {
        enqueueSnackbar(msg, { variant });
    };

    return (
        <>
            <Typography variant="h4">Documento di consegna</Typography>

            <Box mt={4} />

            <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={6}>
                    <Paper
                        elevation={5}
                        direction="row"
                        sx={{
                            p: 2,
                            border: formErrors.customer_id ? "1px solid #FF5630" : "none",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h5">Cliente</Typography>
                            <IconButton
                                onClick={() => {
                                    setCustomerModal(true);
                                }}
                                color="primary"
                            >
                                <Edit />
                            </IconButton>
                        </Box>

                        <Box>
                            <Typography variant="p" color="text.secondary">
                                {formValuesCustomer.company_name || "--"}
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {formValuesCustomer.vat_number || "--"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formValuesCustomer.external_code || "--"}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Box>
                        <FormControl sx={{ width: "100%" }}>
                            <FormLabel>Data documento</FormLabel>
                            <DatePicker
                                onChange={(target) => {
                                    HandlerInput.handleInputDatepickerChange(target, "date");
                                }}
                                error={Boolean(formErrors.date)}
                                helperText={formErrors.date}
                                value={formValues.date ? dayjs(formValues.date) : null}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "100%", mt: 2 }}>
                            <FormLabel>Numero documento</FormLabel>
                            <TextField
                                onChange={HandlerInput.handleInputChange}
                                name="number"
                                value={formValues.number || ""}
                                helperText={formErrors.number}
                                error={Boolean(formErrors.number)}
                            ></TextField>
                        </FormControl>
                    </Box>
                </Grid>
            </Grid>

            <Box mt={4} />

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Descrizione</TableCell>
                            <TableCell align="right">Codice</TableCell>
                            <TableCell align="right">Lotto</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formValuesBody.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.item_type.description}
                                </TableCell>
                                <TableCell align="right">{row.item_type.internal_code}</TableCell>
                                <TableCell align="right">{row.batch_code}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => formBodies.remove(row.id)}>
                                        <RemoveCircle color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                    textAlign: "center",
                                },
                            }}
                        >
                            <TableCell colSpan={4} align="right">
                                <IconButton onClick={() => setItemModal(true)}>
                                    <AddCircle color="secondary" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="body2" color="text.error">
                {formErrors.body}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", my: 4 }}>
                <Link to="/documenti">
                    <Button variant="outlined" color="error">
                        Annulla
                    </Button>
                </Link>

                <Button variant="contained" size="medium" color="primary" onClick={() => POSTapi()}>
                    <Done />
                    <Box mr={1} />
                    Salva
                </Button>
            </Box>

            <SelectItemModal
                modalState={[itemModal, setItemModal]}
                tableChoices={(item) => formBodies.append(item)}
            />
            <SelectCustomerModal
                modalState={[customerModal, setCustomerModal]}
                tableChoices={(item) => setFormValuesCustomer(item)}
            />
        </>
    );
}

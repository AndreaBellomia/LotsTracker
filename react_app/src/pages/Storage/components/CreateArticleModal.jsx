import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
    Button,
    IconButton,
    Box,
    Modal,
    TextField,
    FormControl,
    FormLabel,
    Grid,
    Typography,
} from "@mui/material";

import { manageFetchError, LottiApi } from "@/libs/axios.js";
import { manageHandlerInput } from "@/libs/forms.js";
import ModalBox from "@/layout/components/ModalBox.jsx";

export default function StorageArticleModal({ modalStatus: modalStatus, fetchId: fetchId }) {
    /* State */
    const [open, setOpen] = modalStatus;
    const [id, seId] = fetchId;
    const handleClose = () => {
        setOpen(false);
        seId(undefined), HandlerInput.clearForm();
    };

    const [formValue, setFormValue] = useState({
        id: "",
        description: "",
        external_code: "",
        internal_code: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const HandlerInput = new manageHandlerInput(formValue, setFormValue, setFormErrors);

    useEffect(() => {
        if (id) {
            GETapi(id);
        }
    }, [id]);

    /* Fetch API */
    const GETapi = (id) => {
        try {
            new LottiApi().getWarehouseRegistryDetail(id).then((res) => {
                setFormValue({ ...res.data });
            });
        } catch (error) {
            console.log("error");
        }
    };

    const POSTapi = () => {
        try {
            new LottiApi()
                .postWarehouseItems(formValue)
                .then((_) => {
                    handleClose();
                })
                .catch((error) => {
                    if (!error.status === 400) {
                        throw new Error("Error during request: " + error);
                    }
                    manageFetchError(error, formErrors, setFormErrors);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const PUTapi = () => {
        try {
            new LottiApi()
                .putWarehouseItems(id, formValue)
                .then((_) => {
                    handleClose();
                })
                .catch((error) => {
                    if (!error.status === 400) {
                        throw new Error("Error during request: " + error);
                    }
                    manageFetchError(error, formErrors, setFormErrors);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const saveCommitForm = () => {
        if (id) {
            PUTapi();
        } else {
            POSTapi();
        }
    };

    return (
        <>
            <Modal
                keepMounted
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ModalBox>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6" fontWeight={600} color="text.primary">
                            {id
                                ? `Modifica articolo ${formValue.internal_code}`
                                : "Crea nuovo articolo"}
                        </Typography>
                        <IconButton onClick={handleClose} color="error">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box my={2} />

                    <FormControl sx={{ width: "100%" }}>
                        <Grid container spacing={2}>
                            <Grid
                                item
                                xs={12}
                                lg={8}
                                sx={{ display: "flex", flexDirection: "column" }}
                            >
                                <FormLabel>Descrizione</FormLabel>
                                <TextField
                                    name="description"
                                    value={formValue.description}
                                    onChange={HandlerInput.handleInputChange}
                                    helperText={formErrors.description}
                                    error={Boolean(formErrors.description)}
                                ></TextField>
                            </Grid>
                        </Grid>

                        <Box mt={3} />

                        <Grid container spacing={3}>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ display: "flex", flexDirection: "column" }}
                            >
                                <FormLabel>Codice</FormLabel>
                                <TextField
                                    name="internal_code"
                                    value={formValue.internal_code}
                                    onChange={HandlerInput.handleInputChange}
                                    helperText={formErrors.internal_code}
                                    error={Boolean(formErrors.internal_code)}
                                ></TextField>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ display: "flex", flexDirection: "column" }}
                            >
                                <FormLabel>Codice Esterno</FormLabel>
                                <TextField
                                    name="external_code"
                                    value={formValue.external_code}
                                    onChange={HandlerInput.handleInputChange}
                                    helperText={formErrors.external_code}
                                    error={Boolean(formErrors.external_code)}
                                ></TextField>
                            </Grid>
                        </Grid>

                        <Box my={2} />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button onClick={() => handleClose()} variant="outlined" color="error">
                                Annulla
                            </Button>

                            <Button
                                onClick={() => saveCommitForm()}
                                variant="contained"
                                color="grey"
                            >
                                {id ? <>salva</> : <>conferma</>}
                            </Button>
                        </Box>
                    </FormControl>
                </ModalBox>
            </Modal>
        </>
    );
}

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
    TableContainer,
    TableHead,
    TableRow,
    Table,
    TableBody,
    TableCell
} from "@mui/material";
import { DatePicker, ButtonDocumentBig } from "../../layout/components";
import { manageHandlerInput } from "../../libs/forms.js";

import { RemoveCircle, Add } from '@mui/icons-material';

import SelectItemModal from "../../components/Modals/SelectItem.jsx"


class BodyItem {
    constructor(id, description, itemCode, batchCode) {
        this.id = id;
        this.description = description, 
        this.itemCode = itemCode,
        this.batchCode = batchCode;

    }

    getItemBody() {
        return { id: this.id }
    }
}


class ManageFormBodies {
    constructor(body, setBody, itemCode, batchCode) {
        this.body = body
        this.setBody = setBody
    }

    append(item) {
        if (!this.body.some(existingItem => existingItem.id === item.id)) {
            this.setBody([...this.body, item]);
        }
    }

    remove(id) {
        const updatedValues = this.body.filter(item => item.id !== id);
        this.setBody(updatedValues);
    }
}




export default function ManageDocument() {
    const [itemModal, setItemModal] = useState(false);
    const [formValuesBody, setFormValuesBody] = useState([]);

    const [formValues, setFormValues] = useState({
        body: formValuesBody,
        supplier_id: undefined,
        date: undefined,
        number: undefined,
    });
    const [formErrors, setFormErrors] = useState({});
    const HandlerInput = new manageHandlerInput(formValues, setFormValues, setFormErrors);
    const formBodies = new ManageFormBodies(formValuesBody, setFormValuesBody);

    useEffect(()=> {
        setFormValues({
           ...formValues,
           body: formValuesBody,
        })
    }, [formValuesBody]);


    return (
        <>
            <FormControl sx={{ width: "100%" }}>
                <FormLabel>Data di restituzione</FormLabel>
                <DatePicker
                    onChange={(target) => {
                        HandlerInput.handleInputDatepickerChange(target, "date");
                    }}
                    error={Boolean(formErrors.date)}
                    helperText={formErrors.date}
                    value={dayjs(formValues.date)}
                />
            </FormControl>

            <Box sx={{ mt: 6 }}/>

            <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
                <Button variant="contained" size="medium" color="grey" onClick={() => setItemModal(true)}>
                    <Add />
                    <Box mr={1} />
                    Aggiungi
                </Button>
            </Box>

            <TableContainer component={Paper} >
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
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.item_type.description}
                        </TableCell>
                        <TableCell align="right">{row.item_type.internal_code}</TableCell>
                        <TableCell align="right">{row.batch_code}</TableCell>
                        <TableCell align="right"><IconButton onClick={() => formBodies.remove(row.id)}><RemoveCircle color="error"/></IconButton></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
           


           <SelectItemModal modalState={[itemModal, setItemModal]} tableChoices={(item) => formBodies.append(item)}/>
        </>
    );
}

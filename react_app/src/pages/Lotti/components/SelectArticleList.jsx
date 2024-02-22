import React, { useEffect, useState } from "react";

import {
    Modal,
    Typography,
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Button,
} from "@mui/material";
import ModalBox from "../../../layout/components/ModalBox.jsx";
import InputSearch from "../../../components/InputSearch.jsx";

import FetchApi from "../../../libs/axios.js";

export default function ArticlesListModal({ modalState: modaleState, tableChoices: tableChoices }) {
    const [open, setOpen] = modaleState;

    const [search, setSearch] = useState("");
    const [orderBy, setOrderBy] = useState("");
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        try {
            new FetchApi().getWarehouseRegistry(search, orderBy).then((response) => {
                setTableData(response.data);
            });
        } catch (error) {
            console.log("error");
        }
    }, [orderBy, search]);

    const submitSelect = (obj) => {
        tableChoices(obj);
        setOpen(false);
    };

    return (
        <>
            <Modal
                keepMounted
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ModalBox
                    sx={{
                        width: "600px !important",
                        p: 0,
                        overflow: "hidden",
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <InputSearch setterValue={setSearch} />
                    </Box>
                    <TableContainer sx={{ height: 400 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableBody>
                                {tableData.map((obj, index) => (
                                    <TableRow key={index}>
                                        <TableCell onClick={() => submitSelect(obj)}>
                                            <Box>
                                                <Typography variant="body1">
                                                    {obj.description ? obj.description : "--"}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.disabled"
                                                    fontWeight="bold"
                                                >
                                                    {obj.internal_code ? obj.internal_code : "--"}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ p: 3, textAlign: "end" }}>
                        <Button variant="contained" color="grey" onClick={() => setOpen(false)}>
                            Chiudi
                        </Button>
                    </Box>
                </ModalBox>
            </Modal>
        </>
    );
}

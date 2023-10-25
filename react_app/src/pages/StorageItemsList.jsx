import React, { useEffect, useState } from "react";
import { Button, Box, Modal, TextField, FormControl, FormLabel, Grid } from "@mui/material";

import TableItemsComponent from "../components/Tables/TableItemsComponent.jsx";

import FetchApi from "../libs/axios.js";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function Dashboard() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    return (
        <>
            <TableItemsComponent addModalOpen={handleOpen} key={open} />
        </>
    );
}

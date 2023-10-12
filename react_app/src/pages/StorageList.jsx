import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Modal,
  TextField,
  FormControl,
  FormLabel,
  Grid
} from "@mui/material";

import TableComponent from "../components/StorageList/TableComponent.jsx";
import StorageArticleModal from "../components/Modals/StorageArticleModal.jsx"


import FetchApi from "../libs/axios.js"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function Dashboard() {

  // Modal state
  const [addModalStatusId, setAddModalStatusId] = useState(undefined);
  const [addModalStatus, setAddModalStatus] = useState(false);
  const handleOpen = () => setAddModalStatus(true);
  const handleClose = () => {setAddModalStatus(false), setAddModalStatusId(undefined)};


  return (
    <>
      <TableComponent addModalOpen={handleOpen} addModalId={setAddModalStatusId} key={addModalStatus} />
      
      <StorageArticleModal  modalStatus={[addModalStatus, setAddModalStatus]} fetchId={[addModalStatusId, setAddModalStatusId]} />
    </>
  );
}

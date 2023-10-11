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

import TableItemsComponent from "../components/Tables/TableItemsComponent.jsx";


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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formValues, setFormValues] = useState({
    description: "",
    externalCode: "",
    internalCode: "",
  });

  const [formErrors, setFormErrors] = useState({
    description: "",
    external_code: "",
    internal_code: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    setFormErrors({
      description: "",
      external_code: "",
      internal_code: "",
    })
  };

  const postAddModalData = () => {
    try {
      new FetchApi().postWarehouseItems(formValues.description, formValues.internalCode, formValues.externalCode).then((response) => {
        setOpen(false)
      }).catch((error) => {
        if (!error.status === 400) {
          throw new Error("Error during request: " + error);
        }

        const newErrors = {};
        
        if (error.response.data) {
          Object.keys(error.response.data).forEach((key) => {
            newErrors[key] = error.response.data[key];
          });
        }

        setFormErrors({
          ...formErrors,
          ...newErrors,
        });
      });
    } catch (error) { 
      console.log("error")
    }
  }

  return (
    <>
      <TableItemsComponent addModalOpen={handleOpen} key={open} />
      
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          
          <Box sx={style}>
            <Button onClick={handleClose}>Ciudi</Button>
            <FormControl sx={{ width: '100%' }}>
              <FormLabel>Descrizione</FormLabel>
              <TextField 
                name="description" 
                onChange={handleInputChange} 
                helperText={formErrors.description}
                error={Boolean(formErrors.description)}
              ></TextField>

              <FormLabel>Codice</FormLabel>
              <TextField 
                name="external_code" 
                onChange={handleInputChange} 
                helperText={formErrors.external_code}
                error={Boolean(formErrors.external_code)}
              ></TextField>

              <FormLabel>Codice</FormLabel>
              <TextField 
                name="internal_code" 
                onChange={handleInputChange} 
                helperText={formErrors.internal_code}
                error={Boolean(formErrors.internal_code)}
              ></TextField>

              
              

              <Button onClick={() => postAddModalData()}>Open modal</Button>

            </FormControl>
          </Box>
          
          
        </Modal>
    </>
  );
}

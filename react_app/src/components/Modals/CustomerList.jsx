import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Modal,
  TextField,
  FormControl,
  FormLabel,
  Grid,
  Typography,
  IconButton
} from "@mui/material";


import CloseIcon from "@mui/icons-material/Close";

import ModalBox from "../layout/components/ModalBox.jsx";
import CustomerTable from "../components/Tables/CustomerTable.jsx";



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
      <CustomerTable addModalOpen={handleOpen} key={open} />
      
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

        <ModalBox>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight={600} color="text.primary">
   {/*            {id
                ? `Modifica articolo ${formValue.internal_code}`
                : "Crea nuovo articolo"} */}
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
                onChange={handleInputChange}
                value={formValues.description}
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
                <FormLabel>PIVA</FormLabel>
                <TextField
                  name="vat_number"
                  value={formValues.vat_number}
                  onChange={handleInputChange}
                  helperText={formErrors.vat_number}
                  error={Boolean(formErrors.vat_number)}
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
                  value={formValues.external_code}
                  onChange={handleInputChange}
                  helperText={formErrors.external_code}
                  error={Boolean(formErrors.external_code)}
                ></TextField>
              </Grid>
            </Grid>

            <Box my={2} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={() => handleClose()}
                variant="outlined"
                color="error"
              >
                Annulla
              </Button>

              <Button
                onClick={() => saveCommitForm()}
                variant="contained"
                color="grey"
              >
   {/*              {id ? (
                  <>salva</>
                ) : (
                  <>
                    conferma
                  </>
                )} */}
              </Button>
            </Box>
          </FormControl>
        </ModalBox>
    </>
  );
}

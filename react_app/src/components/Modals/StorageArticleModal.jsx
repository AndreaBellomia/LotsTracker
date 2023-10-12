import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Modal,
  TextField,
  FormControl,
  FormLabel,
  Grid,
} from "@mui/material";

import FetchApi from "../../libs/axios.js";

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

function manageFetchError(error, formError, setFormError) {
  const newErrors = {};

  if (error.response.data) {
    Object.keys(error.response.data).forEach((key) => {
      newErrors[key] = error.response.data[key];
    });
  }

  setFormError({
    ...formError,
    ...newErrors,
  });
}

export default function addModal({
  modalStatus: modalStatus,
  fetchId: fetchId,
}) {
  /* State */
  const [open, setOpen] = modalStatus;
  const [id, seId] = fetchId;
  const handleClose = () => {
    setOpen(false);
    seId(undefined), clearForm();
  };

  const modalStatusFormStructure = {
    id: "",
    description: "",
    external_code: "",
    internal_code: "",
  };
  const [formValue, setFormValue] = useState(modalStatusFormStructure);
  const [formErrors, setFormErrors] = useState(modalStatusFormStructure);

  useEffect(() => {
    if (id) {
      GETapi(id);
    }
  }, [id]);

  /* Fetch API */
  const GETapi = (id) => {
    try {
      new FetchApi().getWarehouseRegistryDetail(id).then((res) => {
        setFormValue({ ...res.data });
      });
    } catch (error) {
      console.log("error");
    }
  };

  const POSTapi = () => {
    try {
      new FetchApi()
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
      new FetchApi()
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

  /* Form Methods  */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });

    setFormErrors({
      description: "",
      external_code: "",
      internal_code: "",
    });
  };

  const saveCommitForm = () => {
    if (id) {
      PUTapi();
    } else {
      POSTapi();
    }
  };

  const clearForm = () => {
    setFormValue(modalStatusFormStructure);
    setFormErrors(modalStatusFormStructure);
  };

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Button onClick={handleClose}>Ciudi</Button>
          <FormControl sx={{ width: "100%" }}>
            <FormLabel>Descrizione</FormLabel>
            <TextField
              name="description"
              value={formValue.description}
              onChange={handleInputChange}
              helperText={formErrors.description}
              error={Boolean(formErrors.description)}
            ></TextField>

            <FormLabel>Codice</FormLabel>
            <TextField
              name="external_code"
              value={formValue.external_code}
              onChange={handleInputChange}
              helperText={formErrors.external_code}
              error={Boolean(formErrors.external_code)}
            ></TextField>

            <FormLabel>Codice</FormLabel>
            <TextField
              name="internal_code"
              value={formValue.internal_code}
              onChange={handleInputChange}
              helperText={formErrors.internal_code}
              error={Boolean(formErrors.internal_code)}
            ></TextField>

            <Button onClick={() => saveCommitForm()}>Open modal</Button>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
}

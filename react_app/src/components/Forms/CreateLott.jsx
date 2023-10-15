import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import {
  AssignmentReturnedOutlined,
  Sell,
  Edit,
  Output,
} from "@mui/icons-material";

import FetchApi, { manageFetchError } from "../../libs/axios.js";
import { DatePicker, ButtonDocumentBig } from "../../layout/components";

export default function CreateLottForm({
  articleListModal: articleListModal,
  articleChoice: articleChoice,
}) {
  const navigate = useNavigate();
  const statusChoices = [
    { label: "--", value: "" },
    { label: "Disponibile", value: "A" },
    { label: "Venduto", value: "B" },
    { label: "Vuoto", value: "E" },
    { label: "Ritornato F.", value: "R" },
  ];

  // Form variables
  const [formErrors, setFormErrors] = useState({});
  const [formValue, setFormValue] = useState({
    empty_date: undefined,
    batch_code: "",
    custom_status: "",
    item_type: "",
    document_from_supplier: "",
    document_to_supplier: "",
    document_customer: "",
  });

  // Article state
  useEffect(() => {
    setFormValue({
      ...formValue,
      item_type: articleChoice.id,
    });
    setFormErrors({});
  }, [articleChoice]);

  /* Form Methods  */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });

    setFormErrors({});
  };

  const handleInputDatepickerChange = (e) => {
    const date = e.$d;
    setFormValue({
      ...formValue,
      empty_date: `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`,
    });
    setFormErrors({});
  };

  // Apis support
  const POSTapi = () => {
    console.log(formValue);
    try {
      new FetchApi()
        .postWarehouseItemsLott(formValue)
        .then((res) => {
          navigate("/lotti");
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

  return (
    <>
      <Typography variant="h3">Crea un Lotto</Typography>
      <Divider sx={{ my: 3 }} />
      <FormControl sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} lg={6}>
            <Paper
              elevation={5}
              direction="row"
              sx={{
                p: 2,
                border: formErrors.item_type ? "1px solid #FF5630" : "none",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5">Articolo</Typography>
                <IconButton
                  onClick={() => {
                    articleListModal(true);
                  }}
                  color="primary"
                >
                  <Edit />
                </IconButton>
              </Box>

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
            </Paper>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Paper elevation={5} direction="row" sx={{ p: 2 }}>
          <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" gutterBottom>
              Dettaglio
            </Typography>
            <Grid container spacing={2}>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <FormLabel>Data di restituzione</FormLabel>
                <DatePicker
                  onChange={(target) => handleInputDatepickerChange(target)}
                  error={Boolean(formErrors.empty_date)}
                  helperText={formErrors.empty_date}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <FormLabel>Numero Lotto</FormLabel>
                <TextField
                  onChange={(target) => handleInputChange(target)}
                  name="batch_code"
                  value={formValue.batch_code}
                  helperText={formErrors.batch_code}
                  error={Boolean(formErrors.batch_code)}
                ></TextField>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <FormLabel>Stato manuale</FormLabel>
                <TextField
                  id="outlined-select-currency"
                  select
                  defaultValue=""
                  helperText="Questo campo viene aggiornato automaticamente"
                >
                  {statusChoices.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Box mt={3} />

        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={4}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <ButtonDocumentBig
                  icon={AssignmentReturnedOutlined}
                  description="xxx del xx/xx/xxxx"
                  title="documento d'ingresso"
                />
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <ButtonDocumentBig
                  icon={Sell}
                  description="xxx del xx/xx/xxxx"
                  title="Documento di vendita"
                />
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <ButtonDocumentBig
                  icon={Output}
                  description="xxx del xx/xx/xxxx"
                  title="documento d'uscita"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box my={2} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link to="/lotti">
            <Button
              onClick={() => handleClose()}
              variant="outlined"
              color="error"
            >
              Annulla
            </Button>
          </Link>

          <Button
            onClick={() => {
              POSTapi();
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

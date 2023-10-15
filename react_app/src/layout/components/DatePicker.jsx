import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function CustomTextField(props) {
  const { trulyAnError, ...other } = props;
  return <TextField {...other} error={trulyAnError ?? props.error} />;
}

export default function CustomDatePicker ( props ) {
  const { ...otherProps } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        slots={{
          textField: CustomTextField,
        }}
        format="DD/MM/YYYY"
        onChange={otherProps.onChange}
        slotProps={{
          textField: {
            trulyAnError: otherProps.error,
            helperText: otherProps.helperText,
          }
        }}
        value={otherProps.value}
      />
    </LocalizationProvider>
  );
}

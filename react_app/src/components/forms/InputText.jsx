import React from 'react';
import { TextField } from '@mui/material';


export default function ({ name, value, error, handler }) {
  return (
    <>
      <TextField
        onChange={handler.handleInputChange}
        name={name}
        value={value || ''}
        helperText={error}
        error={Boolean(error)}
      />
    </>
  )
}
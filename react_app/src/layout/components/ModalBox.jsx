import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
} from "@mui/material";



const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "100%",
  maxWidth: "60rem",
  backgroundColor: theme.palette.background.paper,
  boxShadow: 24,
  padding: "1.5rem",
  borderRadius: "1rem",


  [theme.breakpoints.up('md')]: {
    width: "75%",
  },
  [theme.breakpoints.up('xl')]: {
    width: "50%",
  },
  
}));

  
export default ModalBox
import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/layout/mainTheme.jsx";

import Router from "@/Routers.jsx";
import Snackbar, { SnackProvider } from "@/components/Snackbar.jsx";



const App = () => {

    return (
        <ThemeProvider theme={theme}>
            <Snackbar>
                <SnackProvider/>
                <Router />
            </Snackbar>
        </ThemeProvider>
    );
};

export default App;
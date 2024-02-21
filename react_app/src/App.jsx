import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/layout/mainTheme.jsx";

import Router from "@/Routers.jsx";
import Snackbar from "@/components/Snackbar.jsx";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Snackbar>
                <Router />
            </Snackbar>
        </ThemeProvider>
    );
};

export default App;

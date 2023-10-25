import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./layout/mainTheme.jsx";

import Router from "./Routers.jsx";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router />
        </ThemeProvider>
    );
};

export default App;

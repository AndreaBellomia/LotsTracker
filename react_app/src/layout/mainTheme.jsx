import { createTheme } from "@mui/material/styles";
import * as colors from "@mui/material/colors";

import palette from "./palette.jsx";
import components from "./muiComponents.jsx";

const theme = createTheme({
    type: "light",
    palette: { ...palette },
    components: { ...components },
});

export default theme;

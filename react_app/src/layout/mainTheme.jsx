import { createTheme } from "@mui/material/styles";
import * as colors from "@mui/material/colors";

const theme = createTheme({
  type: "light",
  palette: {
    background: {
      default: "#F9FAFB",
    },
    primary: {
      lighter: "#C8FAD6",
      light: "#5BE49B",
      main: "#00A76F",
      dark: "#007867",
      darker: "#004B50",
      mainGradient: "linear-gradient(135deg, #5BE49B 0%, #00A76F 100%)",
    },
    secondary: {
      lighter: "#EFD6FF",
      light: "#C684FF",
      main: "#8E33FF",
      dark: "#5119B7",
      darker: "#27097A",
    },
    info: {
      lighter: "#CAFDF5",
      light: "#61F3F3",
      main: "#00B8D9",
      dark: "#006C9C",
      darker: "#003768",
    },
    success: {
      lighter: "#D3FCD2",
      light: "#77ED8B",
      main: "#22C55E",
      dark: "#118D57",
      darker: "#065E49",
    },
    warning: {
      lighter: "#FFF5CC",
      light: "#FFD666",
      main: "#FFAB00",
      dark: "#B76E00",
      darker: "#7A4100",
    },
    error: {
      lighter: "#FFE9D5",
      light: "#FFAC82",
      main: "#FF5630",
      dark: "#B71D18",
      darker: "#7A0916",
    },
    grey: {
      100: "#F9FAFB",
      200: "#F4F6F8",
      300: "#DFE3E8",
      400: "#C4CDD5",
      500: "#919EAB",
      600: "#637381",
      700: "#454F5B",
      800: "#212B36",
      900: "#161C24",
    },

    text: {
      primary: "#212B36",
      secondary: "#637381",
      disabled: "#919EAB",
    },
    variants: {
      shadow: {
        primary: 'rgba(25, 118, 210, 0.3)',
        secondary: 'rgba(245, 0, 87, 0.3)',
        success: 'rgba(76, 175, 80, 0.3)',
        warning: 'rgba(255, 152, 0, 0.3)',
        info: 'rgba(33, 150, 243, 0.3)',
        error: 'rgba(244, 67, 54, 0.3)',
      },
    },
  },

  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#2F3746",
          color: "white",
          padding: "10px",
        },
        icon: {
          color: "white",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFF",
          borderRadius: ".5rem",
          color: "white",
          overflow: "hidden",
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { size: "small" },
          style: {
            borderRadius: ".3rem",
            height: "2.125rem",
            px: ".5rem",
          },
        },
        {
          props: { size: "medium" },
          style: {
            borderRadius: ".5rem",
            height: "2.5rem",
            px: "1rem",
          },
        },
        {
          props: { size: "large" },
          style: {
            borderRadius: ".7rem",
            height: "3rem",
            px: "1rem",
          },
        },
      ],
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: ".5rem",
          color: "#212B36",
          border: "1px solid rgba(0, 0, 0,.125)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: ".6rem",

        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F4F6F8",
          border: "1px dotted #F4F6F8"
        },
      },
    },
    MuiChip: {
    },
  },
});

export default theme;

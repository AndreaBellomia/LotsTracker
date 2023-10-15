import palette from "./palette.jsx"



const components = {
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
        color: "black",
        overflow: "hidden",
      },
    },
    variants: [
      {
        props: { elevation: 5 },
        style: {
          boxShadow:
            "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
        },
      },
    ],
  },
  MuiTypography: {
    variants: [
      {
        props: { variant: "h1" },
        style: {
          fontSize: "2.25rem",
          fontWeight: "bold"
        },
      },
      {
        props: { variant: "h2" },
        style: {
          fontSize: "2rem",
          fontWeight: "bold"
        },
      },
      {
        props: { variant: "h3" },
        style: {
          fontSize: "1.75rem",
          fontWeight: "bold"
        },
      },
      {
        props: { variant: "h4" },
        style: {
          fontSize: "1.5rem",
          fontWeight: "bold"
        },
      },
      {
        props: { variant: "h5" },
        style: {
          fontSize: "1.25rem",
          fontWeight: "bold"
        },
      },
      {
        props: { variant: "h6" },
        style: {
          fontSize: "1rem",
          fontWeight: "bold"
        },
      },
    ]
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
      {
        props: { color: "grey" },
        style: {
          backgroundColor: "#212B36",
          color: "white",
          boxShadow: "none",
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
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: ".5rem",
        color: "#212B36",
        border: 0,
      },
      input: {
        padding: ".75rem 1rem",
      },
      notchedOutline: {
        border: "1px solid #919EAB",
      },
    },
  },

  MuiTableSortLabel: {
    styleOverrides: {
      root: {
        color: "#637381",
      },
    },
  },

  MuiPaginationItem: {
    styleOverrides: {
      root: {
        "&.Mui-selected": {
          color: "white",
        },
        "&.Mui-selected:hover": {
          color: "black",
        },
      },
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: ".6rem",
        borderColor: "#F4F6F8",
      },
      head: {
        padding: ".8rem",
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        "&:hover": {
          backgroundColor: "#F4F6F8",
        },
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: "#F4F6F8",
        border: "1px dotted #F4F6F8",
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: "0.5rem",
      },
      label: {
        fontWeight: 600,
      },
    },

    variants: [
    ]
  }

  
};

export default components;

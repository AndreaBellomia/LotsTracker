import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";

import { Box, Typography } from "@mui/material";

const IconPaperContainer = styled(Box)(({ theme }) => ({
    p: 4,
    borderRadius: "100000rem",
    aspectRatio: "1/1",
    position: "relative",
    left: "50%",
    transform: "translate(-50%, 0%)",
    border: `4px dashed ${theme.palette.grey[400]}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    cursor: "pointer",
    maxWidth: "5rem",
    transition:
        "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",

    "&:hover": {
        backgroundColor: theme.palette.secondary.lighter,
        borderColor: theme.palette.secondary.main,
        boxShadow:
            "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
    },

    "&:active": {
        boxShadow: "none",
    },
}));

export default function ButtonDocumentBig({
    icon: IconComponent,
    description: description,
    title: title,
    onClick: onClick,
}) {
    const IconStyledComponent = styled(IconComponent)(({ theme }) => ({
        fontSize: "5rem",
        width: "80%",
        height: "80%",
        color: theme.palette.secondary.main,
    }));
    return (
        <Box sx={{ px: 4, my: 2, textAlign: "center" }}>
            <Typography variant="bod1">{title}</Typography>
            <IconPaperContainer my={1} sx={{}}>
                <div
                    style={{
                        width: "80%",
                        height: "80%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onClick={onClick}
                >
                    <IconStyledComponent />
                </div>
            </IconPaperContainer>
            <Typography variant="bod1">{description}</Typography>
        </Box>
    );
}

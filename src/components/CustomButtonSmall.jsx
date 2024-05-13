import { tokens } from "../theme";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Box, Button, useTheme } from "@mui/material";

const CustomButtonSmall = ({
  btnBG,
  btnColor,
  btnTxt,
  btnStartIcon,
  btnEndIcon,
  onClick,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Grid
      sx={{
        ".customBtn": {
          backgroundColor: btnBG,
          color: btnColor,
          borderRadius: "24px",
          boxShadow: "0px 10px 20px 0px rgba(0, 0, 0, 0.08)",
          fontSize: "9px",
          fontWeight: "600",
          letterSpacing: "1.25px",
          padding: "6px 20px",
        },
        "& .customBtn:hover": {
          backgroundColor: btnBG,
          boxShadow: "0px 10px 20px 0px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Button
        className="customBtn"
        variant="contained"
        startIcon={btnStartIcon}
        endIcon={btnEndIcon}
        onClick={onClick}
      >
        {btnTxt}
      </Button>
    </Grid>
  );
};

export default CustomButtonSmall;

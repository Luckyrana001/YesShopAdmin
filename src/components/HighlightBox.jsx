import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import BoltIcon from "@mui/icons-material/Bolt";

const HighlightBox = ({ highlightName, highlightCount, highlightBG, highlightColor }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
      <Box
        sx={{
          background: colors.grey[900],
          borderRadius: "12px",
          padding: "10px",
          border: "1px solid" + colors.grey[600],
        }}
      >
        <Grid container direction={"row"}>
          <Grid item xs={10}>
            <Grid container direction={"column"}>
              <Grid
                item
                sx={{
                  margin: "20px 0 0 20px",
                  padding: "0",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                {highlightName}
              </Grid>

              <Grid
                item
                sx={{
                  margin: "0px 0 0 20px",
                  fontSize: "36px",
                  fontWeight: "800",
                }}
              >
                {highlightCount}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={2}>
            <Box
              display={"flex"}
              alignItems="center"
              justifyContent={"center"}
              sx={{
                // backgroundColor: {highlightColor},
                height: "100%",
                borderRadius: "8px",
                color: colors.greenAccent[900],
              }}
              backgroundColor={highlightBG}
              color={highlightColor}
              mx={"auto"}
            >
              <BoltIcon></BoltIcon>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default HighlightBox;

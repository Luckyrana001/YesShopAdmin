import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import React, { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useState } from "react";

const UserActivityInfo = ({ sectionHeading, sectionIcon, data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [earmarkActivityDetails, setearmarkActivityDetails] = useState([]);

  useEffect(() => {
    if (data) {
      setearmarkActivityDetails(data);
    }
  }, [data]);

  return (
    <Box>
      {earmarkActivityDetails.length > 0 ? (
        <Grid
          container
          direction={"column"}
          mt={3}
          p={3}
          xs={12}
          mb={20}
          sx={{
            background: colors.grey[900],
            borderRadius: "12px",
          }}
        >
          <Grid container item xs={21.5} fontSize={20} fontWeight={700}>
            <Grid item xs={6}>
              Activity
            </Grid>
            <Grid item xs={6} justify="flex-end" >
              Date / Time{" "}
            </Grid>
          </Grid>

          {earmarkActivityDetails.map((row) => (
            <Box key={row.id}>
              <Grid
                container
                direction={"row"}
                mt={2}
                spacing={2}
                alignItems={"center"}
              >
                <Grid item>
                  <Avatar
                    sx={{
                      bgcolor: colors.grey[900],
                      color: colors.grey[100],
                      border: "1px solid #888888",
                    }}
                  >
                    SY
                  </Avatar>
                </Grid>

                {/* {
                    "createdBy": "41334",
                    "action": "Unfrozen",
                    "companyName": "Eleven Six Marketing - Bandar Puteri Puchong",
                    "reason": null,
                    "date": "2024-05-07 18:45:12.0"
                }, */}
                <Grid item spacing={3}>
                  <Grid
                    container
                    direction={"row"}
                    alignItems={"center"}
                    spacing={1}
                  >
                    {/* <Grid item><Typography>{row.activity}</Typography></Grid> */}
                    <Grid item>
                      <Typography variant="h6">{row.createdBy}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>changed Account Status </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">{row.action}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>For </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6"> {row.companyName}</Typography>
                    </Grid>
                  </Grid>
                  {/* <Typography color={colors.primary[100]} fontWeight={"500"}>Attachment (Proof)</Typography> */}
                </Grid>

                <Grid
                  item
                  sx={{
                    position: "absolute",
                    right: "4%",
                    color: colors.grey[300],
                  }}
                >
                  {row.date}
                </Grid>
              </Grid>
            </Box>
          ))}
        </Grid>
      ) : (
        ""
      )}
    </Box>
  );
};

export default UserActivityInfo;

import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import GreetingHeader from "../../components/GreetingHeader";
import SectionHeader from "../../components/SectionHeader";
import SimpleTable from "../../components/SimpleTable";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import HighlightStats from "../../components/HighlightStats";
import * as React from "react";

const PayoutsArchive = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  

  return (
    /* Main Container */
    <Grid
      container
      component="main"
      direction={"column"}
      sx={{
        // height: "100vh",
        m: "0 2.5%" /* Approx 30px */,
        borderRadius: "18px",
      }}
    >
      {/* Greetings Header */}
      <Grid container>
        <Grid item>
          <GreetingHeader name={"On Hold"}></GreetingHeader>
        </Grid>
      </Grid>
      {/* Greetings Header */}

      {/* Highlight Stats */}
      <HighlightStats
        highlightTotal={"100,000"}
        highlight1={"Dealers"}
        highlight1Stat={"4"}
        highlight2={"Device Reimburse"}
        highlight2Stat={"RM 100"}
        highlight3={"Incentives"}
        highlight3Stat={"RM 31.47"}
      ></HighlightStats>
      {/* Highlight Stats */}


      {/* Validations Section */}
      <Grid
        container
        mt={3}
        border={"1px solid" + colors.grey[600]}
        borderRadius={2}
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
      >
        <SectionHeader
          sectionIcon={"../../assets/common/onhold.svg"}
          sectionHeading={"On Hold"}
        ></SectionHeader>

        <SimpleTable
          statusData={"In Validation"}
          statusBG={colors.primary[300]}
        ></SimpleTable>

      </Grid>
      {/* Validations Section */}


    </Grid>
    /* Main Container */
  );
};

export default PayoutsArchive;


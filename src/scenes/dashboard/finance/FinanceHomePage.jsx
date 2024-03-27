import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
// import { tokens } from "../../../theme";
import { tokens } from "../../../theme";
import GreetingHeader from "../../../components/GreetingHeader";
import React from "react";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import BoltIcon from '@mui/icons-material/Bolt';
import HighlightBox from "../../../components/HighlightBox";

// import Paper from '@mui/material/Paper';
// import { styled } from '@mui/material/styles';
// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1.5),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

const FinanceHomePage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

  
   
    return (

    // <Box sx={{ flexGrow: 1 }}>
        <Grid
        container
        component="main"
        direction={"column"}
        sx={{ 
          height: "100vh",
          m: "0 2.5%", /* Approx 30px */
          borderRadius: "18px",
        }}
      >
        <Grid container>
          <Grid item><GreetingHeader name={"Sung Pik Yeng (Kellie) 👋🏻"}></GreetingHeader></Grid>
        </Grid>
        
        <Grid 
          container
          direction={"row"}
          spacing={3}
          >
            
          <HighlightBox
            highlightName={"Needs Approval"}
            highlightCount={"100"}
            highlightBG={colors.redAccent[200]}
            highlightColor={colors.greenAccent[100]}
          >
          </HighlightBox>

          <HighlightBox
            highlightName={"Scheduled"}
            highlightCount={"10"}
            highlightBG={colors.blueAccent[100]}
            highlightColor={colors.greenAccent[100]}
          >
          </HighlightBox>

          <HighlightBox
            highlightName={"Validations"}
            highlightCount={"12"}
            highlightBG={colors.redAccent[100]}
            highlightColor={colors.greenAccent[100]}
          >
          </HighlightBox>


        </Grid>

      </Grid>

      
      

      // </Box>
  );
};

export default FinanceHomePage;
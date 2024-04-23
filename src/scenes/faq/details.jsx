import { Box, useTheme, Link, IconButton, TextField} from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import GreetingHeader from "../../components/GreetingHeader";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import ReportLink from "../../components/ReportLinks";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const FilterReports = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box>
      {/* <Header title="FAQ" subtitle="Frequently Asked Questions Page" /> */}

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
      {/* Header */}
      <Grid container direction={"row"} alignItems={"center"}>
        
        <Grid item mr={2}><IconButton href="/reports" width={12}><img src={"../../assets/common/Back.svg"} width={12} /></IconButton></Grid>
        <Grid item><Typography color={colors.grey[100]} fontWeight={"600"} variant="h3">Reports</Typography></Grid>

      </Grid>
      {/* Header */}


      {/* Form Filter */}

      <Grid container mt={2} p={3} direction={"column"} alignItems={"center"} 
        sx={{
          background: colors.grey[900],
          borderRadius: "12px"
        }}
      >

        <Grid item>
          <Typography color={colors.grey[100]} fontWeight={"500"} variant="h5">Select your Preferences</Typography>
        </Grid>
        

        <Grid container mt={3} xs={6} spacing={3}>
          
          <Grid container xs={12} alignItems={"center"}>
            <Grid item xs={4}><Typography color={colors.grey[100]} fontWeight={"500"} variant="h6">Transaction Date</Typography></Grid>
            <Grid item xs={8}><TextField fullWidth id="outlined-basic" label="Date" variant="outlined" /></Grid>
          </Grid>

          <Grid container xs={12} alignItems={"center"}>
            <Grid item xs={4}><Typography color={colors.grey[100]} fontWeight={"500"} variant="h6">Payout Date</Typography></Grid>
            <Grid item xs={8}><TextField fullWidth id="outlined-basic" label="Payout Date" variant="outlined" /></Grid>
          </Grid>

          <Grid container xs={12} alignItems={"center"}>
            <Grid item xs={4}><Typography color={colors.grey[100]} fontWeight={"500"} variant="h6">Report Type</Typography></Grid>
            <Grid item xs={8}><TextField fullWidth id="outlined-basic" label="Channel Sales" variant="outlined" /></Grid>
          </Grid>

          <Grid container xs={12} alignItems={"center"}>
            <Grid item xs={4}><Typography color={colors.grey[100]} fontWeight={"500"} variant="h6">Sub Type</Typography></Grid>
            <Grid item xs={8}><TextField fullWidth id="outlined-basic" label="Role-based/Hierarchy based " variant="outlined" /></Grid>
          </Grid>

          <Grid container xs={12} alignItems={"center"}>
            <Grid item xs={4}><Typography color={colors.grey[100]} fontWeight={"500"} variant="h6">Company</Typography></Grid>
            <Grid item xs={8}><TextField fullWidth id="outlined-basic" label="Choose One" variant="outlined" /></Grid>
          </Grid>

        </Grid>

      </Grid>

      {/* Form Filter */}

      </Grid>
      
    </Box>
  );
};

export default FilterReports;
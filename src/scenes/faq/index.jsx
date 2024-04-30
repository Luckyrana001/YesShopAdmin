import { Box, useTheme, Link } from "@mui/material";
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

const FAQ = () => {
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
        <Grid container>
          <Grid item>
            <GreetingHeader
              greeting={"Welcome Back"}
              name={"Sung Pik Yeng (Kellie) 👋🏻"}
            ></GreetingHeader>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              background: colors.grey[900],
              borderRadius: 2,
              padding: 3,
            }}
          >
            <Typography
              mb={2}
              color={colors.grey[100]}
              fontWeight={"500"}
              variant="h5"
            >
              Reports
            </Typography>

            <Accordion defaultExpanded sx={{ boxShadow: "none" }}>
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{ color: colors.primary[100], fontSize: "32px" }}
                  />
                }
              >
                <Typography
                  color={colors.grey[100]}
                  fontWeight={"500"}
                  variant="h5"
                >
                  1. Channel Sales
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Box ml={3}>
                  <ReportLink
                    reportName="Role-based/Hierarchy based"
                    url="/reportDetails"
                  />
                  <ReportLink reportName="Dealer Sales Report" url="#" />
                  <ReportLink reportName="Dealer Inventory  Report " url="#" />
                  <ReportLink reportName="On Hold Report" url="#" />
                  <ReportLink reportName="Exclusion List Report" url="#" />
                  <ReportLink
                    reportName="Pending Verification Report"
                    url="#"
                  />
                  <ReportLink reportName="Withholding tax report" url="#" />
                  <ReportLink reportName="Incentives Report" url="#" />
                  <ReportLink reportName="CVP Sales" url="#" />
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ boxShadow: "none" }}>
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{ color: colors.primary[100], fontSize: "32px" }}
                  />
                }
              >
                <Typography
                  color={colors.grey[100]}
                  fontWeight={"500"}
                  variant="h5"
                >
                  2. Dealer
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Box ml={3}>
                  <ReportLink reportName="Link" url="#" />
                  <ReportLink reportName="Link" url="#" />
                  <ReportLink reportName="Link" url="#" />
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ boxShadow: "none" }}>
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{ color: colors.primary[100], fontSize: "32px" }}
                  />
                }
              >
                <Typography
                  color={colors.grey[100]}
                  fontWeight={"500"}
                  variant="h5"
                >
                  3. Finance
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Box ml={3}>
                  <ReportLink reportName="Link" url="#" />
                  <ReportLink reportName="Link" url="#" />
                  <ReportLink reportName="Link" url="#" />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FAQ;

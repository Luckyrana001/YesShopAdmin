import { tokens } from "../theme";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Box, useTheme, Link } from "@mui/material";


const ReportLink = ({ reportName, url }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    return (
            <Grid mb={3}>
                <Link href={url} underline="none" fontSize={16} color={colors.grey[100]}>
                    {reportName}
                </Link>
            </Grid>
        );
    };
    
    export default ReportLink;
    
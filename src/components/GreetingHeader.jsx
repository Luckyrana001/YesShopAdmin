import { Typography, Grid, useTheme } from "@mui/material";
import { tokens } from "../theme";

const GreetingHeader = ({ name }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (

    <Grid container mb="30px" direction={"column"}>
        <Grid item>
            <Typography variant="h6" color={colors.grey[100]}>
                Welcome Back
            </Typography>
        </Grid>
        
        <Grid item>
            <Typography
                variant="h3"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
            >
                {name}
            </Typography>
        </Grid>

    </Grid>

  );
};

export default GreetingHeader;

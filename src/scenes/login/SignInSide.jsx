import * as React from "react";
import { tokens } from "../../theme";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";

import { isAuthPageAtom } from "../../config/AppConfig";
import { atom, useAtom } from "jotai";
import * as CONSTANT from "../../constants/Constant";
import { Button, Typography, useTheme } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function SignInSide() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [isAuthPage, setAuthStatus] = useAtom(isAuthPageAtom);

  //  login button click listener
  function goToDashboard() {
   
    setAuthStatus(false);
    navigate(CONSTANT.FINANCE_DASHBOARD);
  }

  return (
    // <ThemeProvider theme={theme}>
      // {/* Main Container - Body */}
      <Grid container component="main" sx={{ height: "100vh" }}>
        {/* BG */}
        <Grid
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          sx={{
            backgroundImage: "url(/assets/login/Login-BG-2.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          {/* Login Container */}
          <Grid
            item
            xs={12}
            sm={6}
            md={5}
            lg={5}
            xl={5}
            component={Paper}
            elevation={6}
            sx={{
              borderRadius: 2,
              border: "1px solid #E4EBF7",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                py: 6,
                px: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
              >
                Login to Account
              </Typography>

              <Box component="form" noValidate sx={{ mt: 1 }}>
                {/* Form Elements */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />

                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => {
                    goToDashboard();
                  }}
                >
                  Sign In
                </Button>
                {/* Form Elements */}
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                {/* <Copyright sx={{ mt: 5 }} /> */}
              </Box>
            </Box>
            {/* Header */}
          </Grid>
          {/* Login Container */}
        </Grid>
        {/* BG */}
      </Grid>
      // {/* Main Container - BG */}
    // </ThemeProvider>
  );
}

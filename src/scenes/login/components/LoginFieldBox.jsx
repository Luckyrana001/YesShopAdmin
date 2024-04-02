import {
  Button,
  FormControlLabel,
  Grid,
  Link,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { atom, useAtom } from "jotai";
import * as React from "react";
import { isAuthPageAtom } from "../../../config/AppConfig";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import * as CONSTANT from "../../../constants/Constant";
import { Formik } from "formik";
import * as yup from "yup";
import Box from "@mui/material/Box";
import { CheckBox } from "@mui/icons-material";
// Define a functional component named MyComponent
function LoginFieldBox() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [isAuthPage, setAuthStatus] = useAtom(isAuthPageAtom);

  const handleFormSubmit = (values) => {
    //values.preventDefault();
    console.log(values);
    //goToDashboard()
  };

  //  login button click listener
  function goToDashboard() {
    setAuthStatus(false);
    navigate(CONSTANT.FINANCE_DASHBOARD);
  }
  return (
    <Box sx={{ mt: 1 }}>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="emailValue"
                autoComplete="current"
                autoFocus
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.emailValue}
                error={!!touched.emailValue && !!errors.emailValue}
                helperText={touched.emailValue && errors.emailValue}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="passwordValue"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.passwordValue}
                error={!!touched.passwordValue && !!errors.passwordValue}
                helperText={touched.passwordValue && errors.passwordValue}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControlLabel
                control={<CheckBox value="remember" color="primary" />}
                label="Remember me"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
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
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default LoginFieldBox;

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  emailValue: yup.string().required("required"),
  passwordValue: yup.string().required("required"),
  //   email: yup.string().email("invalid email").required("required"),
  //   contact: yup
  //     .string()
  //     .matches(phoneRegExp, "Phone number is not valid")
  //     .required("required"),
  //   address1: yup.string().required("required"),
  //   address2: yup.string().required("required"),
});
const initialValues = {
  //   user: "",
  //   lastName: "",
  emailValue: "pdc_branch",
  passwordValue: "ytlc@xm1234",
  //   address1: "",
  //   address2: "",
};

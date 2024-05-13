import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { atom, useAtom } from "jotai";
import * as React from "react";
import {
  collapseMenu,
  isAuthPageAtom,
  selectedSidebarTab,
  sessionIdStatus,
  showErrorAlertDialog,
} from "../../../config/AppConfig";
import * as CONSTANT from "../../../constants/Constant";
import { Formik } from "formik";
import * as yup from "yup";
import Box from "@mui/material/Box";
import { initializeEncryption } from "../../../services/AesGcmEncryption";
import {
  getBasicAuth,
  getUserLoginDetails,
} from "../../../services/ApiService";
import ConnectionStatus from "../../../utils/ConnectionStatus";
import { SnackbarProvider, useSnackbar } from "notistack";
import UseOnlineStatus from "../../../utils/UseOnlineStatus";
import {
  saveToLocalStorage,
  getFromLocalStorage,
  deleteAllKeyFromLocalStorage,
  saveToLocalStorageJsonObject,
} from "../../../utils/localStorageUtils";
import CustomProgressDialog from "../../../components/CustomProgressDialog";
import ShowErrorAlertDialog from "../../../components/ErrorAlertDialog";
import {
  ALERT,
  AUTHENTICATING_PLEASE_WAIT,
  DONT_HAVE_A_ACCOUNT_SIGNUP,
  ERROR,
  ERROR_WHILE_AUTHENTICATING_USER,
  ERROR_WHILE_RETRIEVING_BASIC_AUTH,
  FORGOT_PASSWORD,
  LOADING_CONFIGRATION_PLEASE_WAIT,
  NO_INTERNET_CONNECTION_FOUND,
  REMEMBER_ME,
  YOU_ARE_OFFLINE,
  YOU_ARE_ONLINE,
} from "../../../constants/Strings";
import DebugLog from "../../../utils/DebugLog";
import {
  BASIC_AUTH_TOKKEN,
  LOGIN_ID,
  LOGIN_RESPONSE,
  MESSAGE_KEY,
  REMEMBER_ME_CHECKBOX,
  REMEMBER_USER_NAME,
  SESSION_ID,
  USER_ID,
  USER_NAME,
  USER_ROLE,
} from "../../../constants/LocalStorageKeyValuePairString";
import { generateRequestId } from "../../../utils/RequestIdGenerator";
import { ApiType } from "../../../services/ApiTags";

function LoginFieldBox() {
  const navigate = useNavigate();
  const [, setAuthStatus] = useAtom(isAuthPageAtom);
  const [getDialogStatus, setErrorDialog] = useAtom(showErrorAlertDialog);
  const isNetworkConnectionAvailable = UseOnlineStatus();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(ALERT);
  const [content, setContent] = useState("");
  const [, setError] = useState("");
  const [getProgressbarText, setProgressbarText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [sessionIdState, setSessionIdState] = useAtom(sessionIdStatus);
  const [selected, setSelected] = useAtom(selectedSidebarTab);
  const [isCollapsed, setIsCollapsed] = useAtom(collapseMenu);

  const updateSavedUserName = () => {
    const isCheckboxRemembered =  getFromLocalStorage(REMEMBER_ME_CHECKBOX)
    
     if(isCheckboxRemembered && isCheckboxRemembered === "true") {
      const userName =  getFromLocalStorage(REMEMBER_USER_NAME)
      initialValues.emailValue = userName
      setChecked(true)
    }else{
      setChecked(false)
      initialValues.emailValue = 'bizops_head'
    }
  };
  const getConfigration = () => {
    const basicAuthTokken = getFromLocalStorage(BASIC_AUTH_TOKKEN);
    if (basicAuthTokken === undefined || basicAuthTokken === null)
      requestBasicAuth(false);
  };

  useEffect(() => {
    updateSavedUserName()
    resetAllConfigration()
    getConfigration()
    showNoInternetSnackBar();
  }, [isNetworkConnectionAvailable, enqueueSnackbar]);

  const resetAllConfigration = () => {
    setSelected("Dashboard")
    setIsCollapsed(false)
    saveToLocalStorage(SESSION_ID, "");
    setAuthStatus(true);
    setError("");
    setErrorDialog(false);
    deleteAllKeyFromLocalStorage();
  };

  // Generate Basic Auth hHeader()
  const requestBasicAuth = (isLoginApiCallRequired) => {
    if (isNetworkConnectionAvailable) {
      setProgressbarText(LOADING_CONFIGRATION_PLEASE_WAIT);
      setLoading(true);
      getBasicAuth(true)
        .then((response) => {
          saveToLocalStorage(MESSAGE_KEY, response.data.messageKey);
          saveToLocalStorage(BASIC_AUTH_TOKKEN, response.data.basicAuthToken);

          if (isLoginApiCallRequired) {
            doSignUp(email, password);
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          showErrorAlert(ERROR, ERROR_WHILE_RETRIEVING_BASIC_AUTH + error);
        });
    } else {
      showErrorAlert(ALERT, NO_INTERNET_CONNECTION_FOUND);
    }
  };

  const showNoInternetSnackBar = () => {
    if (isNetworkConnectionAvailable) {
      enqueueSnackbar(YOU_ARE_ONLINE);
    } else {
      enqueueSnackbar(YOU_ARE_OFFLINE, {
        autoHideDuration: 3000,
        variant: "error",
      });
    }
  };

  async function doSignUp(email, pswd) {
    try {
      if (isNetworkConnectionAvailable) {
        if (getFromLocalStorage(BASIC_AUTH_TOKKEN) != null) {
          setProgressbarText(AUTHENTICATING_PLEASE_WAIT);
          setLoading(true); // Hide the progress dialog

          const loginId = email;
          const password = pswd;

          const signInData = {
            userName: loginId,
            password: password,
          };

          initializeEncryption(
            signInData,
            getFromLocalStorage(MESSAGE_KEY),
            ApiType.SIGN_IN
          )
            .then((encryptedLoginData) => {
              saveToLocalStorage(LOGIN_ID, signInData.userName);
              const signInReqestData = {
                requestId: generateRequestId(),
                loginId: signInData.loginId,
                basicAuthToken: getFromLocalStorage(BASIC_AUTH_TOKKEN),
                contentData: encryptedLoginData,
              };

              getUserLoginDetails(signInReqestData)
                .then((response) => {
                  const sessionId = response.data.result.sessionId;

                  saveToLocalStorage(SESSION_ID, sessionId);
                  saveToLocalStorageJsonObject(
                    LOGIN_RESPONSE,
                    response.data.result.userAccessDetails.menuList
                  );
                  setSessionIdState(sessionId);
                  saveToLocalStorage(USER_ID, response.data.result.userId);
                  saveToLocalStorage(USER_NAME, response.data.result.name);
                  saveToLocalStorage(USER_ROLE, response.data.result.role);

                  // open dashbaord on the basis of response type and login path
                  goToDashboard();

                  setLoading(false);
                })
                .catch((error) => {
                  setLoading(false);
                  if (error.data!=null && error.data.responseCode !=null && error.data.responseCode != -1) {
                    const message =
                      error.response != null ? error.response : error.message;
                    showErrorAlert(
                      error.message,
                      ERROR_WHILE_AUTHENTICATING_USER + JSON.stringify(message)
                    );
                  } else {
                    const message =
                      error.data != null
                        ? error.data.displayErrorMessage
                        : error.message;
                    showErrorAlert(
                      ERROR,
                      ERROR_WHILE_AUTHENTICATING_USER + JSON.stringify(message)
                    );
                  }
                });
            })
            .catch((error) => {
              const message =
                error.response != null ? error.response : error.message;
              showErrorAlert(
                error.message,
                ERROR_WHILE_AUTHENTICATING_USER + JSON.stringify(message)
              );
            });
        } else {
          requestBasicAuth(true);
        }
      } else {
        showErrorAlert(ALERT, NO_INTERNET_CONNECTION_FOUND);
      }
    } catch (error) {
      const message = error.response != null ? error.response : error.message;
      showErrorAlert(
        error.message,
        ERROR_WHILE_AUTHENTICATING_USER + JSON.stringify(message)
      );
    }
  }
  const handleFormSubmit = (values) => {
    if (isNetworkConnectionAvailable) {
      setEmail(values.emailValue);
      setPassword(values.passwordValue);

      if(checked===true){
        const userName = values.emailValue
        saveToLocalStorage(REMEMBER_USER_NAME,userName)
        DebugLog("REMEMBER_USER_NAME=====",getFromLocalStorage(REMEMBER_USER_NAME))
      } else {
        DebugLog("REMEMBER_ is empty=====",getFromLocalStorage(REMEMBER_USER_NAME))
        saveToLocalStorage(REMEMBER_USER_NAME,"")
        saveToLocalStorage(REMEMBER_ME_CHECKBOX,false)
      }
   
      if (getFromLocalStorage(BASIC_AUTH_TOKKEN) != null)
      
      doSignUp(values.emailValue, values.passwordValue);
      // goToDashboard();
    } else {
      showErrorAlert(ALERT, NO_INTERNET_CONNECTION_FOUND);
    }
  };

  function showErrorAlert(title, content) {
    try {
      setError();
      setLoading(false);

      setTitle(title);
      setContent(content);
      setErrorDialog(true);
    } catch (error) {
      DebugLog(error);
    }
  }
  const handleRemberMeClick = (event) => {
    setChecked(event.target.checked);
    saveToLocalStorage(REMEMBER_ME_CHECKBOX,event.target.checked)
    
    // if(event.target.checked===true){
    //   saveToLocalStorage(REMEMBER_ME_CHECKBOX,true)
    // }else{
    //   saveToLocalStorage(REMEMBER_ME_CHECKBOX,false)
    // }
    // Do something with the new value of checked
    console.log("Checkbox checked:", event.target.checked);
  };
  //  login button click listener
  function goToDashboard() {
    setAuthStatus(false);
    navigate(CONSTANT.FINANCE_DASHBOARD);
  }

  return (
    <Box>
      <SnackbarProvider maxSnack={3}>
        <ConnectionStatus />
        <ShowErrorAlertDialog
          status={getDialogStatus}
          title={title}
          content={content}
        />
        {isNetworkConnectionAvailable ? (
          <CustomProgressDialog open={loading} text={getProgressbarText} />
        ) : (
          showNoInternetSnackBar()
        )}

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
                    initialValues={email}
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
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleRemberMeClick}
                        color="primary"
                      />
                    }
                    label={REMEMBER_ME}
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
                        {FORGOT_PASSWORD}
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2">
                        {DONT_HAVE_A_ACCOUNT_SIGNUP}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </SnackbarProvider>
    </Box>
  );
}

export default LoginFieldBox;

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
  emailValue: "bizops_head",
  passwordValue: "ytlc@xm1234",
  //   address1: "",
  //   address2: "",
};

// emailValue: "bizops_head",
// passwordValue: "ytlc@xm1234",

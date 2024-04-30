import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import GreetingHeader from "../../../components/GreetingHeader";
import SectionHeader from "../../../components/SectionHeader";
import SimpleTable from "../../../components/SimpleTable";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import HighlightBox from "../../../components/HighlightBox";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useEffect, useState } from "react";

import ConnectionStatus from "../../../utils/ConnectionStatus";
import { SnackbarProvider, useSnackbar } from "notistack";
import UseOnlineStatus from "../../../utils/UseOnlineStatus";
import {
  getFromLocalStorage,
  getFromLocalStorageJsonObject,
} from "../../../utils/localStorageUtils";
import CustomProgressDialog from "../../../components/CustomProgressDialog";
import ShowErrorAlertDialog from "../../../components/ErrorAlertDialog";
import { atom, useAtom } from "jotai";
import {
  isAuthPageAtom,
  showErrorAlertDialog,
} from "../../../config/AppConfig";
import {
  ALERT,
  ERROR_FOUND_DURING_API_CALL,
  ERROR_WHILE_FETCHING_DATA,
  FETCHING_PAYOUT_SUMMARY_PLEASE_WAIT,
  LOADING_PLEASE_WAIT,
  NO_INTERNET_CONNECTION_FOUND,
  YOU_ARE_OFFLINE,
  YOU_ARE_ONLINE,
} from "../../../constants/Strings";
import { initializeEncryption } from "../../../services/AesGcmEncryption";
import DebugLog from "../../../utils/DebugLog";
import {
  BASIC_AUTH_TOKKEN,
  LOGIN_ID,
  LOGIN_RESPONSE,
  MESSAGE_KEY,
  SESSION_ID,
  USER_ID,
  USER_NAME,
} from "../../../constants/LocalStorageKeyValuePairString";
import {
  generateRandomId,
  generateRequestId,
} from "../../../utils/RequestIdGenerator";
import { ApiErrorCode, ApiType } from "../../../services/ApiTags";
import {
  getOnHoldSummary,
  getPayoutSummary,
} from "../../../services/ApiService";
import OnHoldSummaryTable from "../../../components/OnHoldSummaryTable";

const FinanceHomePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  const isNetworkConnectionAvailable = UseOnlineStatus();

  const [, setAuthStatus] = useAtom(isAuthPageAtom);
  const [getDialogStatus, setErrorDialog] = useAtom(showErrorAlertDialog);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(ALERT);
  const [content, setContent] = useState("");
  const [, setError] = useState("");
  const [getProgressbarText, setProgressbarText] = useState("");

  const [payoutSummary, setPayoutSummary] = useState([]);
  const [onHoldData, setOnHoldData] = useState([]);
  const [userName, setUserName] = useState([]);

  function checkUserAuthExistOrNot() {
    if (getFromLocalStorage(SESSION_ID) === "") {
      navigate("/");
      return;
    }
  }

  useEffect(() => {
    setUserName(getFromLocalStorage(USER_NAME));

    checkUserAuthExistOrNot();

    // get Payout Summary
    getPayoutSummaryData();

    // get on hold Summary
    getOnHoldData();

    // show no internet available message
    showNoInternetSnackBar();

    navigate(blockNavigation);
  }, [isNetworkConnectionAvailable, enqueueSnackbar, navigate]);

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

  function getPayoutSummaryData() {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(FETCHING_PAYOUT_SUMMARY_PLEASE_WAIT);
        setLoading(true); // Hide the progress dialog

        // const id = "1";
        const pageNumber = 0;
        const pageSize = 100;

        const payoutSummaryContentData = {
          // id: id,
          pageNumber: pageNumber,
          pageSize: pageSize,
        };

        initializeEncryption(
          payoutSummaryContentData,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_PAYOUT_SUMMARY
        ).then((encryptedContentData) => {
          const payoutSummaryRequestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          getPayoutSummary(payoutSummaryRequestData)
            .then((response) => {
              // DebugLog(
              //   "getPayoutSummary response.data=====" +
              //     JSON.stringify(response.data)
              // );

              const rowsWithIds = response.data.result.content.map((row) => ({
                ...row,
                id: generateRandomId(),
              }));

              setPayoutSummary(rowsWithIds);
              setLoading(false);
            })
            .catch((error) => {
              if (error.data.errorCode === ApiErrorCode.SESSION_ID_NOT_FOUND) {
                try {
                  navigate("/");
                } catch (error) {
                  DebugLog("error " + error);
                }
              } else {
                const message =
                  error.data != null
                    ? error.data.displayErrorMessage
                    : "Unknown";

                if (message)
                  showErrorAlert(
                    error.message,
                    ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
                  );
              }
            });
        });
      } else {
        showErrorAlert(ALERT, NO_INTERNET_CONNECTION_FOUND);
      }
    } catch (error) {
      const message = error.response != null ? error.response : error.message;
      showErrorAlert(
        error.message,
        ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
      );
    }
  }

  function getOnHoldData() {
    try {
      if (isNetworkConnectionAvailable) {
        //setProgressbarText(LOADING_PLEASE_WAIT);
        //setLoading(true); // Hide the progress dialog

        const requestData = {
          requestId: generateRequestId(),
          loginId: getFromLocalStorage(LOGIN_ID),
          sessionId: getFromLocalStorage(SESSION_ID),
          //contentData: encryptedContentData,
        };

        getOnHoldSummary(requestData)
          .then((response) => {
            setOnHoldData(response.data.result.onHoldSummaryList);
            //setLoading(false);
          })
          .catch((error) => {
            if (!error.errorCode === ApiErrorCode.SESSION_ID_NOT_FOUND) {
              const message =
                error.response != null ? error.displayErrorMessage : "Unknown";

              if (message)
                showErrorAlert(
                  error.message,
                  ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
                );
            } else {
              try {
                navigate("/");
              } catch (error) {
                DebugLog("error " + error);
              }
            }
          });
      } else {
        showErrorAlert(ALERT, NO_INTERNET_CONNECTION_FOUND);
      }
    } catch (error) {
      const message = error.response != null ? error.response : error.message;
      showErrorAlert(
        error.message,
        ERROR_FOUND_DURING_API_CALL + JSON.stringify(message)
      );
    }
  }

  function blockNavigation(location, action) {
    // Block navigation if action is "pop", which indicates back/forward button press
    if (action === "pop") {
      // Optionally, you can show a message to the user before blocking navigation
      alert("Back button is disabled.");
      return false;
    }
    return true; // Allow navigation for other actions like "push" or "replace"
  }

  return (
    /* Main Container */

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
              <GreetingHeader
                greeting={"Welcome Back"}
                name={userName + " 👋🏻"}
              ></GreetingHeader>
            </Grid>
          </Grid>
          {/* Greetings Header */}

          {/* Highlights Section */}
          <Box sx={{ whiteSpace: "pre" }}>
            <Grid container spacing={3}>
              <HighlightBox
                highlightName={"To Approve"}
                highlightCount={"100"}
                highlightBG={colors.primary[100]}
                highlightColor={colors.greenAccent[100]}
                highlightIcon={"../../assets/common/Attention.svg"}
              ></HighlightBox>

              <HighlightBox
                highlightName={"Scheduled"}
                highlightCount={"10"}
                highlightBG={colors.primary[200]}
                highlightColor={colors.greenAccent[100]}
                highlightIcon={"../../assets/common/Scheduled.svg"}
              ></HighlightBox>

              <HighlightBox
                highlightName={"Validations"}
                highlightCount={"12"}
                highlightBG={colors.primary[300]}
                highlightColor={colors.greenAccent[100]}
                highlightIcon={"../../assets/common/Validations.svg"}
              ></HighlightBox>
            </Grid>
          </Box>
          {/* Highlights Section */}

          {/* Payouts Section */}
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
              sectionIcon={"../../assets/common/Payouts.svg"}
              sectionHeading={"Payouts"}
            ></SectionHeader>

            <SimpleTable
              statusData={"Needs Approval"}
              statusBG={colors.primary[100]}
              data={payoutSummary}
            ></SimpleTable>
          </Grid>
          {/* Payouts Section */}

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
              sectionIcon={"../../assets/common/Validations-black.svg"}
              sectionHeading={"Validation"}
            ></SectionHeader>

            <SimpleTable
              statusData={"In Validation"}
              statusBG={colors.primary[300]}
              //data={payoutSummary}
            ></SimpleTable>
          </Grid>
          {/* Validations Section */}

          {/* On Hold Section */}
          <Grid
            container
            mt={3}
            border={"1px solid" + colors.grey[600]}
            borderRadius={2}
            xs={12}
            sm={12}
            md={12}
            pb={12}
            lg={12}
            xl={12}
          >
            <SectionHeader
              sectionIcon={"../../assets/common/OnHold.svg"}
              sectionHeading={"On Hold"}
            ></SectionHeader>

            <OnHoldSummaryTable
              statusData={"On Hold"}
              statusBG={colors.primary[300]}
              data={onHoldData}
            ></OnHoldSummaryTable>
          </Grid>
          {/* On Hold Section */}
        </Grid>
      </SnackbarProvider>
    </Box>
    /* Main Container */
  );
};

export default FinanceHomePage;

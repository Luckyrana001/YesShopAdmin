import { tokens } from "../../theme";
import * as React from "react";

import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import GreetingHeader from "../../components/GreetingHeader";
import SectionHeader from "../../components/SectionHeader";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Divider from "@mui/material/Divider";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ConnectionStatus from "../../utils/ConnectionStatus";
import { SnackbarProvider, useSnackbar } from "notistack";
import UseOnlineStatus from "../../utils/UseOnlineStatus";
import {
  getFromLocalStorage,
  getFromLocalStorageJsonObject,
} from "../../utils/localStorageUtils";
import CustomProgressDialog from "../../components/CustomProgressDialog";
import ShowErrorAlertDialog from "../../components/ErrorAlertDialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { atom, useAtom } from "jotai";
import { isAuthPageAtom, showErrorAlertDialog } from "../../config/AppConfig";
import {
  ALERT,
  ERROR_WHILE_FETCHING_DATA,
  ERROR_WHILE_FETCHING_PAYOUT_DETAILS,
  LOADING_PLEASE_WAIT,
  NO_INTERNET_CONNECTION_FOUND,
  PROCESSING_PLEASE_WAIT,
  YOU_ARE_OFFLINE,
  YOU_ARE_ONLINE,
} from "../../constants/Strings";
import { initializeEncryption } from "../../services/AesGcmEncryption";
import DebugLog from "../../utils/DebugLog";
import {
  BASIC_AUTH_TOKKEN,
  LOGIN_ID,
  MESSAGE_KEY,
  NAV_PAYOUT_ALL_TRANSACTION_DETAIL_DATA,
  SESSION_ID,
  USER_ID,
  USER_ROLE,
} from "../../constants/LocalStorageKeyValuePairString";
import {
  generateRandomId,
  generateRequestId,
} from "../../utils/RequestIdGenerator";
import { ApiErrorCode, ApiType } from "../../services/ApiTags";
import {
  getPayoutAllTransactions,
  getPayoutDetails,
  getPayoutSummary,
  holdPayoutTransaction,
  payoutRequestApproval,
} from "../../services/ApiService";

import * as CONSTANT from "../../constants/Constant";
import HighlightsSecondary from "../../components/HighlightsSecondary";
import HighlightsPrimary from "../../components/HighlightsPrimary";
import { globalSearchText } from "../../config/AppConfig";
import NoDataFound from "../../components/NoDataFound";
import {
  payoutAllTransactionColumnHeader,
  payoutDetailsColumnHeader,
} from "../../components/ColumnHeader";
import CustomButton from "../../components/CustomButton";
import { iconsImgs } from "../../utils/images/images";

const PayoutsTransactionDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNetworkConnectionAvailable = UseOnlineStatus();

  const navigate = useNavigate();
  const [, setAuthStatus] = useAtom(isAuthPageAtom);
  const [getDialogStatus, setErrorDialog] = useAtom(showErrorAlertDialog);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(ALERT);
  const [content, setContent] = useState("");
  const [, setError] = useState("");
  const [getProgressbarText, setProgressbarText] = useState("");

  const [payoutSummary, setPayoutSummary] = useState([]);

  const [gridHeight, setGridHeight] = useState(108); // Default height
  const [totalNoOfRows, setTotalNoOfRows] = useState(10); // Default height
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useAtom(globalSearchText);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [userRole, setUserRole] = useState([]);

  // State to store the extracted IDs
  const [idsArray, setIdsArray] = useState([]);
  const [companyCode, setCompanyCodeArray] = useState([]);

  function checkUserAuthExistOrNot() {
    if (getFromLocalStorage(SESSION_ID) === "") {
      navigate("/");
      return;
    }
  }

  const handlePageJump = (event) => {
    setCurrentPage(parseInt(event.target.value, 10) - 1);
  };

  const filteredRows = payoutSummary.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  function getUserRole() {
    setUserRole(getFromLocalStorage(USER_ROLE));
  }
  // increase - decrease list layout height on available list itmes count
  function getDataGridHeight() {
    // Calculate the total height required for the grid
    const headerHeight = 65; // Height of header row
    const rowHeight = 65; // Height of each data row
    const rowCount = totalNoOfRows; // Total number of data rows
    const totalHeight = headerHeight + rowCount * rowHeight;

    // Set the grid height
    setGridHeight(totalHeight);
  }
  useEffect(() => {
    getUserRole();

    checkUserAuthExistOrNot();

    getDataGridHeight();

    // get all Payout transaction details
    getPayoutAllTransactionDetail();

    // getPayoutSummaryData();

    showNoInternetSnackBar();

    navigate(blockNavigation);
  }, [isNetworkConnectionAvailable, enqueueSnackbar, setTotalNoOfRows]);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const requestPayoutApproval = () => {
    const selectedData = payoutSummary.filter((row) =>
      selectedRows.includes(row.id)
    );
    console.log("Selected rows data:", selectedData);

    if (selectedData.length > 0) {
      const navData = getFromLocalStorageJsonObject(
        NAV_PAYOUT_ALL_TRANSACTION_DETAIL_DATA
      );
      DebugLog("nav Daat=======" + JSON.stringify(navData));

      const extractCompanyCode = selectedData.map((row) => row.companyCode);
      const extractId = selectedData.map((row) => row.id);
      const onHoldSelectedRowData = {
        id: extractId,
        remark: "this is remarks",
        companyCode: extractCompanyCode,
        startDate: selectedData[0].startDate,
        endDate: selectedData[0].endDate,
        cutOffDate: navData.cutOffDate,
        payoutCycle: navData.payoutCycle,
        payoutStatus: navData.payoutStatus,
        payoutByDate: navData.payoutDate,
      };
      DebugLog(
        "request payout approval content data=======" +
          JSON.stringify(onHoldSelectedRowData)
      );
      payoutRequestApprovalApi(onHoldSelectedRowData);
    } else {
      showErrorAlert("Alert", "Please choose some rows first!");
    }
  };
  async function payoutRequestApprovalApi(requestData) {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(PROCESSING_PLEASE_WAIT);
        setLoading(true); // Hide the progress dialog

        initializeEncryption(
          requestData,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_PAYOUT_SUMMARY
        ).then((encryptedContentData) => {
          const payoutRequestApprovalData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          payoutRequestApproval(payoutRequestApprovalData)
            .then((response) => {
              showErrorAlert(
                "Success",
                "Selected items are requested for Approval successfully."
              );
              //setPayoutSummary(response.data.result.payoutSummaryList);
              //setTotalNoOfRows(response.data.result.payoutSummaryList.length);
              setLoading(false);
              resetSelection();
            })
            .catch((error) => {
              if (error.errorCode === ApiErrorCode.SESSION_ID_NOT_FOUND) {
                try {
                  navigate("/");
                } catch (error) {
                  DebugLog("error " + error);
                }
              } else {
                const message =
                  error.response != null
                    ? error.displayErrorMessage
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
        ERROR_WHILE_FETCHING_PAYOUT_DETAILS + JSON.stringify(message)
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

  async function getPayoutAllTransactionDetail() {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true); // Hide the progress dialog

        const data = getFromLocalStorageJsonObject(
          NAV_PAYOUT_ALL_TRANSACTION_DETAIL_DATA
        );

        // Create a copy of the object
        const requestObject = { ...data };
        // Remove the key from the copy
        delete requestObject["name"];
        delete requestObject["cutOffDate"];

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_PAYOUT_DETAILS
        ).then((encryptedContentData) => {
          const payoutDetailsRequestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          getPayoutAllTransactions(payoutDetailsRequestData)
            .then((response) => {
              // setTotalNoOfRows(response.data.result.content.length);
              // const rowsWithIds = response.data.result.content.map((row) => ({
              //   ...row,
              //   id: generateRandomId(),
              // }));

              setPayoutSummary(response.data.result.content);

              setLoading(false);
            })
            .catch((error) => {
              if (error.data.errorCode === ApiErrorCode.SESSION_ID_NOT_FOUND) {
                try {
                  navigate("/");
                } catch (error) {
                  DebugLog("error " + error);
                }
              } else if (
                error.data.errorCode === ApiErrorCode.UNABLE_TO_PROCESS_ERROR
              ) {
                try {
                  navigate(CONSTANT.FINANCE_DASHBOARD);
                } catch (error) {
                  DebugLog("error " + error);
                }
              } else {
                const message =
                  error.response != null
                    ? error.displayErrorMessage
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
        ERROR_WHILE_FETCHING_PAYOUT_DETAILS + JSON.stringify(message)
      );
    }
  }
  const startDownload = () => {
    showErrorAlert("", "COMING SOON!");
  };

  const resetSelection = () => {
    setSelectedRows([]);
  };

  const putPayoutOnHold = () => {
    const selectedData = payoutSummary.filter((row) =>
      selectedRows.includes(row.id)
    );
    console.log("Selected rows data:", selectedData);

    if (selectedData.length > 0) {
      const navData = getFromLocalStorageJsonObject(
        NAV_PAYOUT_ALL_TRANSACTION_DETAIL_DATA
      );
      DebugLog("nav Daat=======" + JSON.stringify(navData));

      const extractCompanyCode = selectedData.map((row) => row.companyCode);
      const extractId = selectedData.map((row) => row.id);

      const onHoldSelectedRowData = {
        companyCode: extractCompanyCode,
        id: extractId,
        cutOffDate: navData.cutOffDate,
        payoutCycle: navData.payoutCycle,
        payoutStatus: navData.payoutStatus,
        payoutByDate: navData.payoutDate,
        startDate: selectedData[0].startDate,
        endDate: selectedData[0].endDate,
      };

      DebugLog(
        "onHoldSelectedRowData  Daat=======" +
          JSON.stringify(onHoldSelectedRowData)
      );
      requestPayoutOnHold(onHoldSelectedRowData);
    } else {
      showErrorAlert("Alert", "Please choose some rows first!");
    }
  };

  async function requestPayoutOnHold(requestData) {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(PROCESSING_PLEASE_WAIT);
        setLoading(true); // Hide the progress dialog

        initializeEncryption(
          requestData,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_PAYOUT_SUMMARY
        ).then((encryptedContentData) => {
          const payoutSummaryRequestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          holdPayoutTransaction(payoutSummaryRequestData)
            .then((response) => {
              showErrorAlert(
                "Success",
                "Selected items are put ON-HOLD successfully."
              );
              //setPayoutSummary(response.data.result.payoutSummaryList);
              //setTotalNoOfRows(response.data.result.payoutSummaryList.length);
              setLoading(false);
              resetSelection();
            })
            .catch((error) => {
              if (error.errorCode === ApiErrorCode.SESSION_ID_NOT_FOUND) {
                try {
                  navigate("/");
                } catch (error) {
                  DebugLog("error " + error);
                }
              } else {
                const message =
                  error.response != null
                    ? error.displayErrorMessage
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
        ERROR_WHILE_FETCHING_PAYOUT_DETAILS + JSON.stringify(message)
      );
    }
  }

  function showErrorAlert(title, content) {
    try {
      DebugLog("error.data=====" + content);
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

        {/* Greetings Header */}

        {/* Header */}
        <Grid container direction={"row"} alignItems={"center"} mb={2} ml={2}>
          <Grid item mr={2}>
            <IconButton href={CONSTANT.PAYOUT_ARCHIEVE_ROUTE} width={12}>
              <img src={"../../assets/common/Back.svg"} width={12} />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography
              color={colors.grey[100]}
              fontWeight={"600"}
              variant="h3"
            >
              {
                getFromLocalStorageJsonObject(
                  NAV_PAYOUT_ALL_TRANSACTION_DETAIL_DATA
                ).name
              }
            </Typography>
          </Grid>
        </Grid>
        {/* Header */}

        {/* <GreetingHeader 
        
        greeting={navData.payoutCycle}>
          route={CONSTANT.ON_HOLD_ROUTE}
      </GreetingHeader> */}

        {/* Greetings Header */}

        {/* Highlights Section */}

        <HighlightsPrimary
          highlightTotal={"1,000,000"}
          highlightPayOut={"RM 900,000"}
          payoutDealers={"24"}
          payoutTransactions={"9,800"}
          onHold={"RM 100,000"}
          onHoldDealers={"1"}
          onHoldTransactions={"200"}
        ></HighlightsPrimary>

        {/* <HighlightsSecondary
          highlightTotal={"660,200"}
          highlightTotal2={"560,000"}
          prepaidAmount={"RM 100,200"}
          prepaidAmount2={"RM 54,200"}
          postpaidAmount={"RM 560,000"}
          postpaidAmount2={"RM 185,600"}
        ></HighlightsSecondary> */}

        {/* Highlights Section */}

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
          {/* <Grid container>
        <Grid item>
          <GreetingHeader name={"Payouts"}></GreetingHeader>
        </Grid>
      </Grid> */}
          {/* Greetings Header */}

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
            pb={0}
          >
            <SectionHeader
              sectionIcon={"../../assets/common/Payouts.svg"}
              sectionHeading={"ALL TRANSACTIONS"}
            ></SectionHeader>

            {/* <SimpleTable
          statusData={"In Validation"}
          statusBG={colors.primary[300]}
          data={payoutSummary}
        ></SimpleTable> */}

            {payoutSummary.length > 0 ? (
              <Box
                borderRadius={3}
                flex={1}
                m="0px 0 0 0"
                pb={0}
                height={gridHeight}
                sx={{
                  "& .MuiDataGrid-root": {
                    border: "none",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                  },
                  "& .name-column--cell": {
                    color: colors.redAccent[600],
                    fontWeight: "bold",
                    fontSize: 13,
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "rgba(255,255,255,0.6)",
                    borderBottom: "none",
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: `${colors.grey[300]} !important`,
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    background: "rgba(255,255,255,1)",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: "rgba(255,255,255,0.6)",
                  },
                  "& .MuiCheckbox-root": {
                    //color: `${colors.white[200]} !important`,
                  },
                  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    //  color: `${colors.grey[100]} !important`,
                    //backgroundColor: "rgba(255,255,255,0.6)",
                    // opacity:.5
                  },
                }}
              >
                <DataGrid
                  rows={filteredRows.slice(
                    currentPage * pageSize,
                    (currentPage + 1) * pageSize
                  )}
                  columns={payoutAllTransactionColumnHeader}
                  components={{ Toolbar: GridToolbar }}
                  checkboxSelection
                  onSelectionModelChange={handleSelectionChange}
                  selectionModel={selectedRows}
                  selection // Disable row selection on row click
                  pageSize={pageSize}
                  rowCount={filteredRows.length}
                  pagination
                  //           columnBuffer={2} // Adjusts the number of columns rendered outside the viewport
                  // autoPageSize // Automatically adjusts the page size based on the available height
                  // autoHeight // Adjusts the height of the grid to fit its content

                  onPageChange={handlePageChange}
                  useResizeContainer
                />
              </Box>
            ) : (
              NoDataFound()
            )}
          </Grid>

          {payoutSummary.length > 0 ? (
            <Box>
              <Typography>
                <span>Jump to page: </span>
                <select value={currentPage + 1} onChange={handlePageJump}>
                  {[...Array(totalNoOfRows)].map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </Typography>
            </Box>
          ) : (
            ""
          )}

          {/* Validations Section */}
        </Grid>
        {/* Action Buttons */}

        {payoutSummary.length > 0 ? (
          <Grid item mt={1} justifyContent={"flex-start"} pb={20} mr={10}>
            <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
              {userRole === "Biz Ops Head" ? (
                <CustomButton
                  btnBG={colors.grey[900]}
                  btnColor={colors.grey[100]}
                  // btnStartIcon={
                  //   <img src="../../assets/common/Cross.svg" width={22} />
                  // }
                  btnTxt={"Comment"}
                  onClick={startDownload}
                ></CustomButton>
              ) : (
                ""
              )}

              <CustomButton
                btnBG={colors.grey[900]}
                btnColor={colors.grey[100]}
                // btnStartIcon={
                //   <img src="../../assets/common/Tick.svg" width={22} />
                // }
                btnTxt={"Hold"}
                onClick={putPayoutOnHold}
              ></CustomButton>

              {/* 

{userRole==='Biz Ops Head' ? (
              <CustomButton
                btnBG={colors.grey[900]}
                btnColor={colors.grey[100]}
                // btnStartIcon={
                //   <img src="../../assets/common/Tick.svg" width={22} />
                // }
                btnTxt={"Hold"}
               
              ></CustomButton>
            ) : (
              ""
            )} */}
              <CustomButton
                btnBG={colors.grey[900]}
                btnColor={colors.grey[100]}
                btnStartIcon={
                  <img src="../../assets/common/Download.svg" width={22} />
                }
                btnEndIcon={
                  <img src="../../assets/common/Arrow-down.svg" height={8} />
                }
                btnTxt={"Download"}
                onClick={startDownload}
              ></CustomButton>

              {/* {userRole==='Biz Ops' ? (
              <CustomButton
              btnBG={colors.grey[900]}
              btnColor={colors.grey[100]}
                btnStartIcon={<img src={iconsImgs.check} width={22} />}
                btnTxt={"Request Approval"}
                onClick={requestPayoutApproval}
              ></CustomButton>
            ) : (
              ""
            )} */}

              {/* {userRole==='Biz Ops Head' ? (
              <CustomButton
                btnBG={colors.redAccent[200]}
                btnColor={colors.grey[900]}
                btnStartIcon={<img src={iconsImgs.check} width={22} />}
                btnTxt={"Approve"}
                onClick={requestPayoutApproval}
                
              ></CustomButton>
            ) : (
              ""
            )} */}
            </Stack>
          </Grid>
        ) : (
          ""
        )}
        {/* Action Buttons */}
      </SnackbarProvider>
    </Box>
    /* Main Container */
  );
};

export default PayoutsTransactionDetails;

import { Avatar, Typography } from "@mui/material";

import { Box, useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import { tokens } from "../../theme";
import GreetingHeader from "../../components/GreetingHeader";
import CustomButton from "../../components/CustomButton";
import Grid from "@mui/material/Unstable_Grid2";
import HighlightStats from "../../components/HighlightStats";
import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ConnectionStatus from "../../utils/ConnectionStatus";
import { SnackbarProvider, useSnackbar } from "notistack";
import UseOnlineStatus from "../../utils/UseOnlineStatus";
import { getFromLocalStorage } from "../../utils/localStorageUtils";
import CustomProgressDialog from "../../components/CustomProgressDialog";
import ShowErrorAlertDialog from "../../components/ErrorAlertDialog";
import { useAtom } from "jotai";
import * as CONSTANT from "../../constants/Constant";

import {
  globalSearchText,
  selectedItems,
  showErrorAlertDialog,
} from "../../config/AppConfig";
import {
  ALERT,
  ERROR_WHILE_FETCHING_DATA,
  LOADING_PLEASE_WAIT,
  NO_INTERNET_CONNECTION_FOUND,
  YOU_ARE_OFFLINE,
  YOU_ARE_ONLINE,
} from "../../constants/Strings";
import DebugLog from "../../utils/DebugLog";
import {
  LOGIN_ID,
  MESSAGE_KEY,
  SESSION_ID,
} from "../../constants/LocalStorageKeyValuePairString";
import {
  generateRandomId,
  generateRequestId,
} from "../../utils/RequestIdGenerator";
import {
  deleteEarMarkDetails,
  getEarMarkDetails,
  getEarMarkTimelineDetails,
  getEarmarkActivityDetails,
  getEarmarkDetailsSummaryTopBarItems,
  updateEarMarkDetails,
} from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { earmarksDetailsColumnHeader } from "../../components/ColumnHeader";
import NoDataFound from "../../components/NoDataFound";
import { ApiErrorCode, ApiType } from "../../services/ApiTags";
import UserActivityInfo from "../../components/UserActivity";
import { initializeEncryption } from "../../services/AesGcmEncryption";
import AddEarmarkDialogInput from "./AddEarmarkDialog";
import EarmarkHighlightStats from "../../components/EarmarkHighlightedStats";
import SaveAndRemoveEarmarkDialog from "./SaveAndRemoveEarmarkDialog";

export function EarmarkScreen() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const isNetworkConnectionAvailable = UseOnlineStatus();

  const [getDialogStatus, setErrorDialog] = useAtom(showErrorAlertDialog);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(ALERT);
  const [content, setContent] = useState("");
  const [, setError] = useState("");
  const [getProgressbarText, setProgressbarText] = useState("");

  const [earmarkDetails, setearmarkDetails] = useState([]);
  const [earmarkTimelineDetails, setearmarkTimelineDetails] = useState([]);
  const [earmarkActivityDetails, setearmarkActivityDetails] = useState([]);
  const [earmarkDetailsSummary, setearmarkDetailsSummary] = useState([]);


  const [open, setOpen] = useState(false);
  const [openSaveAndRemoveDialog, setOpenSaveAndRemoveDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useAtom(selectedItems);

  const [gridHeight, setGridHeight] = useState(500); // Default height
  const [totalNoOfRows, setTotalNoOfRows] = useState(0); // Default height
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useAtom(globalSearchText);
  const [selectedRows, setSelectedRows] = React.useState([]);

  // increase - decrease list layout height on available list itmes count
  function getDataGridHeight() {
    // Calculate the total height required for the grid
    const headerHeight = 60; // Height of header row
    const rowHeight = 60; // Height of each data row
    let rowCount = 0;
    if (totalNoOfRows <= pageSize) {
      rowCount = totalNoOfRows; // Total number of data rows
    } else {
      rowCount = pageSize; // Total number of data rows
    }

    const totalHeight = headerHeight + rowCount * rowHeight;

    // Set the grid height
    setGridHeight(totalHeight);
  }
  const handlePageSizeChange = (newPageSize) => {
    // Here, you would fetch new data based on the new page size
    // For the sake of this example, let's just set the page size
    // without updating the data
    console.log("Page size changed to:", newPageSize);
    setPageSize(newPageSize);
    getDataGridHeight();
  };

  useEffect(() => {
    checkUserAuthExistOrNot();

    getDataGridHeight();

    getEarmarksDetailsSummary()

    requestEarMarkDetailsData();

    getEarmarkTimelineDetails();

    getActivityDetails()

    showNoInternetSnackBar();

    navigate(blockNavigation);
  }, [isNetworkConnectionAvailable, enqueueSnackbar, navigate, totalNoOfRows]);

 

  const handleClose = () => {
    setOpen(false);
    DebugLog("Dialog Closed");
  };

  const handleCloseSaveAndRemoveEarmarkDialog = () => {
    setOpenSaveAndRemoveDialog(false);
    DebugLog("Dialog Closed");
  };

  const handlePageJump = (event) => {
    setCurrentPage(parseInt(event.target.value, 10) - 1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  function addNewEarmark() {
    navigate(CONSTANT.ADD_DEALER_ROUTE)
   // setOpen(true);
  }
  function checkUserAuthExistOrNot() {
    if (getFromLocalStorage(SESSION_ID) === "") {
      navigate("/");
      return;
    }
  }
  const filteredRows = earmarkDetails.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  function getEarmarkTimelineDetails() {
    try {
      if (isNetworkConnectionAvailable) {
        //setProgressbarText(LOADING_PLEASE_WAIT);
        // setLoading(true);

        const requestObject = {
          pageNumber: 0,
          pageSize: 100,
          name: "Ghe Network",
          date: "2024-05-04 17:48:00.0",
          code: "A00010001AC",
          vendor: "00004",
          reason: "Negative Balance",
          earmark: "5000",
        };

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_EARMARKS_DETAILS
        ).then((encryptedContentData) => {
          const requestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          getEarMarkTimelineDetails(requestData)
            .then((response) => {
              const contentData =
                response.data.result.earmarkAuditDetails.content.map((row) => ({
                  ...row,
                  id: generateRandomId(),
                }));
              setearmarkTimelineDetails(contentData);
              //setTotalNoOfRows(response.data.result.earmarkDetails.content.length);
              //setLoading(false);
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
        ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
      );
    }
  }
  function getEarmarksDetailsSummary() {
    try {
      if (isNetworkConnectionAvailable) {
        // setProgressbarText(LOADING_PLEASE_WAIT);
        // setLoading(true);

        const requestObject = {
          pageNumber: 0,
          pageSize: 100,
        };

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_EARMARKS_DETAILS
        ).then((encryptedContentData) => {
          const requestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          getEarmarkDetailsSummaryTopBarItems(requestData)
            .then((response) => {
              // const contentData = response.data.result.earmarkDetails.content.map((row) => ({
              //   ...row,
              //   id: generateRandomId(),
              // }));
              setearmarkDetailsSummary(response.data.result);
              //setTotalNoOfRows(response.data.result.earmarkDetails.content.length);
              // setLoading(false);
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
        ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
      );
    }
  }

  function getActivityDetails() {
    try {
      if (isNetworkConnectionAvailable) {
        // setProgressbarText(LOADING_PLEASE_WAIT);
        // setLoading(true);

        const requestObject = {
          pageNumber: 0,
          pageSize: 100,
          fromDate: "2024-04-01T02:49:00.309Z",
          toDate: "2024-05-02T02:49:00.309Z",
        };

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_EARMARKS_DETAILS
        ).then((encryptedContentData) => {
          const requestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          getEarmarkActivityDetails(requestData)
            .then((response) => {
              const contentData =
                response.data.result.earmarkAuditDetails.content.map((row) => ({
                  ...row,
                  id: generateRandomId(),
                }));
              setearmarkActivityDetails(contentData);
              //setTotalNoOfRows(response.data.result.earmarkDetails.content.length);
              // setLoading(false);
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
        ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
      );
    }
  }

  function requestUpdateEarMarkDetailsData(params,earmarkValue,reasonValue) {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true);

        const requestObject = {
          code: params.code,
          date: params.date,
          earmark: earmarkValue,
          // fromDate: params.fromDate,
          // toDate: params.toDate,
          name: params.name,
          reason:reasonValue,
        };

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_EARMARKS_DETAILS
        ).then((encryptedContentData) => {
          const requestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          updateEarMarkDetails(requestData)
            .then((response) => {
              setLoading(false);
              showErrorAlert("SUCCESS", "Earmark updated Successfully.");
              requestEarMarkDetailsData(); // load list again
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
        ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
      );
    }
  }

  function requestDeleteEarMarkDetailsData(params) {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true);

        const requestObject = {
          code: params.code,
          date: params.date,
          earmark: params.earmark,
          // fromDate: params.fromDate,
          // toDate: params.toDate,
          name: params.name,
          reason: params.reason,
        };

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_EARMARKS_DETAILS
        ).then((encryptedContentData) => {
          const requestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          deleteEarMarkDetails(requestData)
            .then((response) => {
              //setearmarkDetails(contentData);
              setLoading(false);
              showErrorAlert("REMOVED", "Earmark removed Successfully.");
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
        ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
      );
    }
  }

  function requestEarMarkDetailsData() {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true);

        const requestObject = {
          pageNumber: 0,
          pageSize: 100,
        };

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_EARMARKS_DETAILS
        ).then((encryptedContentData) => {
          const requestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          getEarMarkDetails(requestData)
            .then((response) => {
              const contentData =
                response.data.result.earmarkDetails.content.map((row) => ({
                  ...row,
                  id: generateRandomId(),
                }));
              setearmarkDetails(contentData);
              setTotalNoOfRows(
                response.data.result.earmarkDetails.content.length
              );
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
        ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
      );
    }
  }
  const handleRowClick = (params) => {

    setSelectedItem(params.row);
    setOpenSaveAndRemoveDialog(true);
    //alert("Back button is disabled.");
  };

  function blockNavigation(location, action) {
    // Block navigation if action is "pop", which indicates back/forward button press
    if (action === "pop") {
      // Optionally, you can show a message to the user before blocking navigation
      alert("Back button is disabled.");
      return false;
    }
    return true; // Allow navigation for other actions like "push" or "replace"
  }

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
              <GreetingHeader name={"Earmark"}></GreetingHeader>
            </Grid>
          </Grid>
          {/* Greetings Header */}

          {/* Highlight Stats */}
          <EarmarkHighlightStats
            highlight0={"Total Dealers"}
            highlightTotal={earmarkDetailsSummary.totalAccounts}
            highlight1={"Total Earmark Amt"}
            highlight1Stat={earmarkDetailsSummary.totalEarmarkAmount}
            highlight2={""}
            highlight2Stat={""}
            highlight3={""}
            highlight3Stat={""}
          ></EarmarkHighlightStats>
          {/* Highlight Stats */}

          {/* On Hold Section */}
          <Grid
            container
            mt={3}
            border={"1px solid" + colors.grey[600]}
            borderRadius={3}
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            pb={2}
          >
            {/* <SectionHeader
              sectionIcon={"../../assets/common/onhold.svg"}
              sectionHeading={"On Hold"}
            ></SectionHeader> */}

            {earmarkDetails.length > 0 ? (
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
                    color: colors.redAccent[200],
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
                  columns={earmarksDetailsColumnHeader}
                  components={{ Toolbar: GridToolbar }}
                  // checkboxSelection
                  selecion
                  pageSize={pageSize}
                  rowCount={filteredRows.length}
                  pagination
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  rowsPerPageOptions={[15, 30, 45, 60]} // Include 10 in the options
                  autoHeight
                  onRowClick={handleRowClick}
                />
              </Box>
            ) : (
              NoDataFound()
            )}
          </Grid>
          <AddEarmarkDialogInput open={open} onClose={handleClose}  />
          
          
          <SaveAndRemoveEarmarkDialog
            open={openSaveAndRemoveDialog}
            onClose={handleCloseSaveAndRemoveEarmarkDialog}
            onDialogButtonClick={requestUpdateEarMarkDetailsData}
            onDialogRemoveButtonClick={requestDeleteEarMarkDetailsData}
            data={selectedItem}
            earmarkTimeline={earmarkTimelineDetails}
          />

          {earmarkDetails.length > 0 ? (
            <Box item mt={10}>
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

          {/* On Hold Section */}

          {/* Action Buttons */}

          {earmarkDetails.length > 0 ? (
            <Grid item mt={1} justifyContent={"flex-start"} pb={3}>
              <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
                <CustomButton
                  btnBG={colors.grey[900]}
                  btnColor={colors.grey[100]}
                  btnTxt={"ADD NEW"}
                  onClick={addNewEarmark}
                ></CustomButton>

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
                ></CustomButton>
              </Stack>
            </Grid>
          ) : (
            ""
          )}
          {/* Action Buttons */}

          {/* activity list */}
          <UserActivityInfo  data={earmarkActivityDetails}/>
          {/* activity list */}
        </Grid>
      </SnackbarProvider>
    </Box>
    /* Main Container */
  );
}

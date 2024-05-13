import { Typography } from "@mui/material";

import { initializeEncryption } from "../../services/AesGcmEncryption";
import * as CONSTANT from "../../constants/Constant";

import { Box, useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import { tokens } from "../../theme";
import GreetingHeader from "../../components/GreetingHeader";
import SectionHeader from "../../components/SectionHeader";
import CustomButton from "../../components/CustomButton";
import Grid from "@mui/material/Unstable_Grid2";
import HighlightStats from "../../components/HighlightStats";
import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ConnectionStatus from "../../utils/ConnectionStatus";
import { SnackbarProvider, useSnackbar } from "notistack";
import UseOnlineStatus from "../../utils/UseOnlineStatus";
import {
  getFromLocalStorage,
  saveToLocalStorageJsonObject,
} from "../../utils/localStorageUtils";
import CustomProgressDialog from "../../components/CustomProgressDialog";
import ShowErrorAlertDialog from "../../components/ErrorAlertDialog";
import { useAtom } from "jotai";
import {
  globalSearchText,
  isAuthPageAtom,
  showErrorAlertDialog,
} from "../../config/AppConfig";
import {
  ALERT,
  ERROR_FOUND_DURING_API_CALL,
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
  NAV_ONHOLD_DETAILS,
  SESSION_ID,
  USER_ROLE,
} from "../../constants/LocalStorageKeyValuePairString";
import {
  generateRandomId,
  generateRequestId,
} from "../../utils/RequestIdGenerator";
import { getOnHoldCompany, getOnHoldSummary } from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import {
  onHoldCompanyColumnHeader,
  onHoldSummaryColumnHeader,
} from "../../components/ColumnHeader";
import NoDataFound from "../../components/NoDataFound";
import { ApiErrorCode, ApiType } from "../../services/ApiTags";
import CancelHoldDialog from "./CancelHoldDialog";

export function OnHoldSummary() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState([]);

  const isNetworkConnectionAvailable = UseOnlineStatus();

  const [, setAuthStatus] = useAtom(isAuthPageAtom);
  const [getDialogStatus, setErrorDialog] = useAtom(showErrorAlertDialog);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(ALERT);
  const [content, setContent] = useState("");
  const [, setError] = useState("");
  const [getProgressbarText, setProgressbarText] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const [onHoldSummary, setOnHoldSummary] = useState([]);
  const [onHoldData, setOnHoldData] = useState([]);
  const [gridHeight, setGridHeight] = useState(500); // Default height
  const [totalNoOfRows, setTotalNoOfRows] = useState(0); // Default height
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useAtom(globalSearchText);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [nbRows, setNbRows] = React.useState(3);

  // increase - decrease list layout height on available list itmes count
  function getDataGridHeight() {
    // Calculate the total height required for the grid
    const headerHeight = 60; // Height of header row
    const rowHeight = 60; // Height of each data row
    let rowCount = 0;
    if(totalNoOfRows <= pageSize){
      rowCount = totalNoOfRows; // Total number of data rows
    }else{
      rowCount = pageSize; // Total number of data rows
    }
    
    const totalHeight = headerHeight + rowCount * rowHeight;

    // Set the grid height
    setGridHeight(totalHeight);
  }


  useEffect(() => {
    getUserRole();

    getDataGridHeight();

    requestOnHoldCompanyData();

    showNoInternetSnackBar();

    navigate(blockNavigation);
  }, [isNetworkConnectionAvailable, enqueueSnackbar, navigate, totalNoOfRows]);

  const handlePageJump = (event) => {
    setCurrentPage(parseInt(event.target.value, 10) - 1);
  };

  const filteredRows = onHoldSummary.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    DebugLog("Dialog Closed");
  };

  function getUserRole() {
    setUserRole(getFromLocalStorage(USER_ROLE));
  }

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const resetSelection = () => {
    setSelectedRows([]);
  };
  const handleRowClick = (params) => {
    //{"companyCode":"A0002","pageNumber":0,"endDate":"2023-07-31","pageSize":100,"startDate":"2023-07-01"}

    const pageNumber = 0;
    const pageSize = 100;
    const onHoldRowSelected = {
      companyCode: params.row.companyCode,
      startDate: params.row.startDate,
      endDate: params.row.endDate,
      pageNumber: pageNumber,
      pageSize: pageSize,
      companyName: params.row.companyName,
    };

    DebugLog("onHoldRowSelected  " + JSON.stringify(onHoldRowSelected));
    saveToLocalStorageJsonObject(NAV_ONHOLD_DETAILS, onHoldRowSelected);
    navigate(CONSTANT.ON_HOLD_DETAILS_ROUTE);
  };

  function requestOnHoldCompanyData() {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true); // Hide the progress dialog

        const requestObject = {
          pageNumber: 0,
          pageSize: 100,
        };

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.ON_HOLD_COMPANY_DETAILS
        ).then((encryptedContentData) => {
          const onholdCompanyRequestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          getOnHoldCompany(onholdCompanyRequestData)
            .then((response) => {
              const contentData = response.data.result.content.map((row) => ({
                ...row,
                id: generateRandomId(),
              }));
              setOnHoldSummary(contentData);
              setTotalNoOfRows(response.data.result.content.length);
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

  function requestOnHoldSummaryData() {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true); // Hide the progress dialog
        //{"pageNumber":0,"pageSize":100}
        const requestData = {
          pageNumber: 0,
          pageSize: 100,
          // requestId: generateRequestId(),
          // loginId: getFromLocalStorage(LOGIN_ID),
          sessionId: getFromLocalStorage(SESSION_ID),
          //contentData: encryptedContentData,
        };

        getOnHoldCompany(requestData)
          .then((response) => {
            setOnHoldSummary(response.data.result.onHoldSummaryList);
            setTotalNoOfRows(response.data.result.onHoldSummaryList.length);
            setLoading(false);
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
                error.response != null ? error.displayErrorMessage : "Unknown";

              if (message)
                showErrorAlert(
                  error.message,
                  ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
                );
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

  const cancelHold = () => {
    const selectedData = onHoldSummary.filter((row) =>
      selectedRows.includes(row.id)
    );
    console.log("Selected rows data:", selectedData);

    if (selectedData.length > 0) {
      setOpenDialog(true);
      //   //const navData = getFromLocalStorageJsonObject(NAV_PAYOUT_DETAIL_DATA)
      //   DebugLog("nav Daat======="+JSON.stringify(navData))

      //   const extractCompanyCode = selectedData.map(row => row.companyCode);

      //  const  onHoldSelectedRowData = {

      //     companyCode : extractCompanyCode,
      //     cutOffDate: navData.cutOffDate,
      //     payoutCycle: navData.payoutCycle,
      //     payoutStatus: navData.payoutStatus,
      //     payoutByDate:navData.payoutDate
      //   };

      //   DebugLog("onHoldSelectedRowData  Daat======="+JSON.stringify(onHoldSelectedRowData))
      //   //requestPayoutOnHold(onHoldSelectedRowData)

      // showErrorAlert("", "COMING SOON!");

      resetSelection();
    } else {
      showErrorAlert("Alert", "Please choose some rows first!");
    }
  };

  const startDownload = () => {
    showErrorAlert("", "COMING SOON!");
    resetSelection();
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
  const handlePageSizeChange = (newPageSize) => {
    // Here, you would fetch new data based on the new page size
    // For the sake of this example, let's just set the page size
    // without updating the data
    console.log('Page size changed to:', newPageSize);
    setPageSize(newPageSize)
    getDataGridHeight()
  };
  function showErrorAlert(title, content) {
    try {
      DebugLog("an error found====" + content);
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
              <GreetingHeader name={"On Hold"}></GreetingHeader>
            </Grid>
          </Grid>
          {/* Greetings Header */}

          {/* Highlight Stats */}
          <HighlightStats
            highlightTotal={"100,000"}
            highlight1={"Dealers"}
            highlight1Stat={"4"}
            highlight2={"Device Reimburse"}
            highlight2Stat={"RM 100"}
            highlight3={"Incentives"}
            highlight3Stat={"RM 31.47"}
          ></HighlightStats>
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
            pb={1}
          >
            <SectionHeader
              sectionIcon={"../../assets/common/onhold.svg"}
              sectionHeading={"On Hold"}
            ></SectionHeader>

            {onHoldSummary.length > 0 ? (
              <Box
                borderRadius={3}
                flex={1}
                m="0px 0 0 0"
             
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
                  columns={onHoldCompanyColumnHeader}
                  components={{ Toolbar: GridToolbar }}
                  checkboxSelection
                  selectionModel={selectedRows}
                  onSelectionModelChange={handleSelectionChange}
                  onPageChange={handlePageChange}
                  pageSize={pageSize}
                  rowCount={filteredRows.length}
                  pagination
                  disableSelectionOnClick // Disable row selection on row click
                  onRowClick={handleRowClick}
                  onPageSizeChange={handlePageSizeChange}
                  rowsPerPageOptions={[15, 30, 45, 60]} // Include 10 in the options
                  autoHeight
                  //rows={filteredRows.slice(0, nbRows)}
                />
              </Box>
            ) : (
              NoDataFound()
            )}
          </Grid>

          {onHoldSummary.length > 0 ? (
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

          {/* On Hold Section */}

          {/* Action Buttons */}

          {onHoldSummary.length > 0 ? (
            <Grid item justifyContent={"flex-start"} pb={10}>
              <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
                {userRole === "Biz Ops" ? (
                  <CustomButton
                    btnBG={colors.grey[900]}
                    btnColor={colors.grey[100]}
                    btnStartIcon={
                      <img src="../../assets/common/Cross.svg" width={22} />
                    }
                    btnTxt={"Request Release"}
                    onClick={cancelHold}
                  ></CustomButton>
                ) : (
                  ""
                )}
                {userRole === "Biz Ops Head" ? (
                  <CustomButton
                    btnBG={colors.grey[900]}
                    btnColor={colors.grey[100]}
                    btnStartIcon={
                      <img src="../../assets/common/Cross.svg" width={22} />
                    }
                    btnTxt={"Cancel"}
                    onClick={cancelHold}
                  ></CustomButton>
                ) : (
                  ""
                )}
                {userRole === "Biz Ops Head" ? (
                  <CustomButton
                    btnBG={colors.grey[900]}
                    btnColor={colors.grey[100]}
                    btnStartIcon={
                      <img src="../../assets/common/Tick.svg" width={22} />
                    }
                    btnTxt={"Release"}
                    onClick={startDownload}
                  ></CustomButton>
                ) : (
                  ""
                )}
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
              </Stack>
            </Grid>
          ) : (
            ""
          )}
          {/* Action Buttons */}
        </Grid>

        <CancelHoldDialog open={openDialog} onClose={handleCloseDialog} />
      </SnackbarProvider>
    </Box>
    /* Main Container */
  );
}

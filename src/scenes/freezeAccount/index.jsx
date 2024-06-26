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
import { generateRandomId, generateRequestId } from "../../utils/RequestIdGenerator";
import { getAccountDetailsToAdd, getFreezeAccountAuditActivityDetails, getFreezeAccountList, getFreezedAccountCount, unFreezeAccountDetails, updateFreezeAccountDetails } from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { earmarksDetailsColumnHeader, freezedAccountDetailsColumnHeader } from "../../components/ColumnHeader";
import NoDataFound from "../../components/NoDataFound";
import { ApiErrorCode, ApiType } from "../../services/ApiTags";
import UserActivityInfo from "../../components/UserActivity";
import { initializeEncryption } from "../../services/AesGcmEncryption";
import AddEarmarkDialogInput from "../earmark/AddEarmarkDialog";
import EarmarkHighlightStats from "../../components/EarmarkHighlightedStats";
import FrozenAccountUpdateDialog from "./FrozenAccountUpdateDialog";

export function FreezeAccountScreen() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const isNetworkConnectionAvailable = UseOnlineStatus();
  const [selectedItem, setSelectedItem] = useAtom(selectedItems);
  const [openSaveAndRemoveDialog, setOpenSaveAndRemoveDialog] = useState(false);

  const [getDialogStatus, setErrorDialog] = useAtom(showErrorAlertDialog);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(ALERT);
  const [content, setContent] = useState("");
  const [, setError] = useState("");
  const [getProgressbarText, setProgressbarText] = useState("");
  const [totalFreezedAccount, setTotalFreezedAccount] = useState("");
  const [accountDetailsToAdd, setAccountDetailsToAdd] = useState("");

  const [allFreezeAccountDetails, setAllFreezeAccountDetails] = useState([]);
  const [freezeAccountAuditActivity, setFreezeAccountAuditActivity] = useState([]);
  const [freezeAccountCount, setFreezeAccountCount] = useState([]);

  const [gridHeight, setGridHeight] = useState(108); // Default height
  const [totalNoOfRows, setTotalNoOfRows] = useState(0); // Default height
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useAtom(globalSearchText);

  const [open, setOpen] = useState(false);

 

  // increase - decrease list layout height on available list itmes count
  function getDataGridHeight() {
    // Calculate the total height required for the grid
    const headerHeight = 100; // Height of header row
    const rowHeight = 65; // Height of each data row
    const rowCount = totalNoOfRows; // Total number of data rows
    const totalHeight = headerHeight + rowCount * rowHeight;

    // Set the grid height
    setGridHeight(totalHeight);
  }

  useEffect(() => {
    checkUserAuthExistOrNot();

    getDataGridHeight();

    getFreezeAccountDetailsData();

    getFreezeAccountActivityDetails();

    getFreezedAccountCountDetails();

    showNoInternetSnackBar();

    navigate(blockNavigation);
  }, [isNetworkConnectionAvailable, enqueueSnackbar, navigate, totalNoOfRows]);
 
  const handleOpen = () => {
    setOpen(true);
  };

  // const handlePageSizeChange = (newPageSize) => {
  //   // Here, you would fetch new data based on the new page size
  //   // For the sake of this example, let's just set the page size
  //   // without updating the data
  //   console.log('Page size changed to:', newPageSize);
  //   setPageSize(newPageSize)
  //   getDataGridHeight()
  // };


 // increase - decrease list layout height on available list itmes count
 function getDataGridHeight() {
  // Calculate the total height required for the grid
  const headerHeight = 100; // Height of header row
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
const handlePageSizeChange = (newPageSize) => {
  // Here, you would fetch new data based on the new page size
  // For the sake of this example, let's just set the page size
  // without updating the data
  console.log('Page size changed to:', newPageSize);
  setPageSize(newPageSize)
  getDataGridHeight()
};
  const handleClose = () => {
    setOpen(false);
    DebugLog("Dialog Closed")
  };

  const handlePageJump = (event) => {
    setCurrentPage(parseInt(event.target.value, 10) - 1);
  };

  

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  function freezeUnfreezeAddDealer(){
    navigate(CONSTANT.UNFREEZE_FREEZE_DEALER_ROUTE)
   // setOpen(true);
  }
  function checkUserAuthExistOrNot() {
    if (getFromLocalStorage(SESSION_ID) === "") {
      navigate("/");
      return;
    }
  }
  const filteredRows = allFreezeAccountDetails.filter((row) =>
  Object.values(row).some((value) =>
    String(value).toLowerCase().includes(searchQuery.toLowerCase())
  )
);
const handleRowClick = (params) => {
  setSelectedItem(params.row);
 
  setOpenSaveAndRemoveDialog(true);
  //alert("Back button is disabled.");
}


const handleCloseSaveAndUnfreezeEarmarkDialog = () => {
  setOpenSaveAndRemoveDialog(false);
  DebugLog("Dialog Closed");
};





function getFreezedAccountCountDetails() {
  try {
    if (isNetworkConnectionAvailable) {
      setProgressbarText(LOADING_PLEASE_WAIT);
      setLoading(true); 

      const requestObject = {
         //pageNumber: 0,
       //  pageSize: 100,
        // sortBy:'name',
        // sortOrder:'ASC',
        // accountCode: '',
        // vendorCode:'',
        //accountName:'',
        //accountName:"Sanity PDC Testing"
      };

      initializeEncryption(
        requestObject,
        getFromLocalStorage(MESSAGE_KEY),
        ApiType.GET_FREEZED_ACCOUNT_COUNT
      ).then((encryptedContentData) => {
        const requestData = {
          requestId: generateRequestId(),
          loginId: getFromLocalStorage(LOGIN_ID),
          sessionId: getFromLocalStorage(SESSION_ID),
          contentData: encryptedContentData,
        };

        getFreezedAccountCount(requestData)
          .then((response) => {
            // const contentData = response.data.result..content.map((row) => ({
            //   ...row,
            //   id: generateRandomId(),
            // }));


            setTotalFreezedAccount( response.data.result.totalFrozen);
            // setTotalNoOfRows(response.data.result.freezeAccountDetails.content.length);
            setLoading(false);
          })
          .catch((error) => {
            if (error.data.errorCode === ApiErrorCode.SESSION_ID_NOT_FOUND) {
              try {
                navigate(CONSTANT.LOGIN);
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



function getFreezeAccountActivityDetails() {
  try {
    if (isNetworkConnectionAvailable) {
      setProgressbarText(LOADING_PLEASE_WAIT);
      setLoading(true); 

      const requestObject = {
         pageNumber: 0,
         pageSize: 100,
        // sortBy:'name',
        // sortOrder:'ASC',
        // accountCode: '',
        // vendorCode:'',
        //accountName:'',
        //accountName:"Sanity PDC Testing"
      };

      initializeEncryption(
        requestObject,
        getFromLocalStorage(MESSAGE_KEY),
        ApiType.GET_FREEZE_ACCOUNT_ACTIVITY_DETAILS
      ).then((encryptedContentData) => {
        const requestData = {
          requestId: generateRequestId(),
          loginId: getFromLocalStorage(LOGIN_ID),
          sessionId: getFromLocalStorage(SESSION_ID),
          contentData: encryptedContentData,
        };

        getFreezeAccountAuditActivityDetails(requestData)
          .then((response) => {
            const contentData = response.data.result.freezeAccountAuditDetails.content.map((row) => ({
              ...row,
              id: generateRandomId(),
            }));
            setFreezeAccountAuditActivity(contentData);
            // setTotalNoOfRows(response.data.result.freezeAccountDetails.content.length);
            setLoading(false);
          })
          .catch((error) => {
            if (error.data.errorCode === ApiErrorCode.SESSION_ID_NOT_FOUND) {
              try {
                navigate(CONSTANT.LOGIN);
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







  function getFreezeAccountDetailsData() {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true); 

        const requestObject = {
          pageNumber: 0,
          pageSize: 100,
          // sortBy:'name',
          // sortOrder:'ASC',
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

          getFreezeAccountList(requestData)
            .then((response) => {
              setTotalFreezedAccount(response.data.result.totalFrozen)
              const contentData = response.data.result.content.map((row) => ({
                ...row,
                id: generateRandomId(),
              }));
              setAllFreezeAccountDetails(contentData);
              setTotalNoOfRows(response.data.result.content.length);
              setLoading(false);
            })
            .catch((error) => {
              if (error.data.errorCode === ApiErrorCode.SESSION_ID_NOT_FOUND) {
                try {
                  navigate(CONSTANT.LOGIN);
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

  function requestUpdateFreezeAccountDetailsData(params,updatedValue) {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true);

        const requestObject = {
          //{"accountCode":"A7124","actionStatus":"1","unFreezeReason":"incentive paid"}

          //companyName: updatedValue.company,
          accountCode: updatedValue.code,
          actionStatus: "",
          unFreezeReason: updatedValue.frozenReason,
         // freezeReason: updatedValue.frozenReason,
         // pic:updatedValue.pic,
         // bankAccountNumber:updatedValue.accountNo,
         // bankName:updatedValue.bank,
        // status:params.status
        //  unFreezeReason:updatedValue.frozenReason
        };

        // "accountCode": "string",
        // "accountName": "string",
        // "bankAccountNumber": "string",
        // "bankName": "string",
        // "freezeReason": "string",
        // "pic": "string",
        // "status": "string",
        // "unFreezeReason": "string"


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

          updateFreezeAccountDetails(requestData)
            .then((response) => {
              setLoading(false);
              showErrorAlert("UPDATED", "Freeze account details updated Successfully.");
              getFreezeAccountDetailsData(); // load list again
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

  function requestUnFreezeAccountDetailsData(params,updatedValue) {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true);

        const requestObject = {
          accountCode: updatedValue.code,
          actionStatus: "1",
          unFreezeReason: updatedValue.frozenReason,
          // code: params.code,
          // date: params.date,
          // earmark: params.earmark,
          // fromDate: params.fromDate,
          // toDate: params.toDate,
          // name: params.name,
          // reason: params.reason,
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

          unFreezeAccountDetails(requestData)
            .then((response) => {
              //setearmarkDetails(contentData);
              setLoading(false);
              showErrorAlert("UNFREEZED", "Account un-freezed successfully.");
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
        <AddEarmarkDialogInput open={open} onClose={handleClose} />
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
              <GreetingHeader name={"Freeze Accounts"}></GreetingHeader>
            </Grid>
          </Grid>
          {/* Greetings Header */}

          {/* Highlight Stats */}
          <EarmarkHighlightStats
           highlight0={"Total Frozen"}
            highlightTotal={totalFreezedAccount}
            highlight1={''}
            highlight1Stat={""}
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

            {allFreezeAccountDetails.length > 0 ? (
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
                  columns={freezedAccountDetailsColumnHeader}
                  components={{ Toolbar: GridToolbar }}
                 //checkboxSelection
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

          {allFreezeAccountDetails.length > 0 ? (
            <Box mt={1}>
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

          <FrozenAccountUpdateDialog
            open={openSaveAndRemoveDialog}
            onClose={handleCloseSaveAndUnfreezeEarmarkDialog}
            onDialogButtonClick={requestUpdateFreezeAccountDetailsData}
            onDialogRemoveButtonClick={requestUnFreezeAccountDetailsData}
            data={selectedItem}
          />

          {/* Action Buttons */}

          {allFreezeAccountDetails.length > 0 ? (
            <Grid item mt={1} justifyContent={"flex-start"} pb={5}>
              <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
               

                <CustomButton
                  btnBG={colors.grey[900]}
                  btnColor={colors.grey[100]}
                  btnTxt={"ADD NEW"}
                  onClick={freezeUnfreezeAddDealer}
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
          <UserActivityInfo data={freezeAccountAuditActivity} />
             {/* activity list */}
                
           
        </Grid>
      </SnackbarProvider>
    </Box>
    /* Main Container */
  );
}

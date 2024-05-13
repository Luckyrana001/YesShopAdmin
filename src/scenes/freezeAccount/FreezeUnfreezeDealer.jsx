import {
  Avatar,
  IconButton,
  Typography,
  colors,
  InputBase,
  TextField,
} from "@mui/material";

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

import { globalSearchText, selectedItems, showErrorAlertDialog } from "../../config/AppConfig";
import {
  ALERT,
  ERROR_WHILE_FETCHING_DATA,
  LOADING_PLEASE_WAIT,
  NO_INTERNET_CONNECTION_FOUND,
  PROCESSING_PLEASE_WAIT,
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
  addFreezeAccount,
  getAccountDetailsToAdd,
  getEarMarkDetails,
  unFreezeAccountDetails,
  updateFreezeAccountDetails,
} from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import NoDataFound from "../../components/NoDataFound";
import { ApiErrorCode, ApiType } from "../../services/ApiTags";
import UserActivityInfo from "../../components/UserActivity";
import { initializeEncryption } from "../../services/AesGcmEncryption";
import AddEarmarkDialogInput from "../earmark/AddEarmarkDialog";
import SearchIcon from "@mui/icons-material/Search";
import ToolbarFilterButton from "../earmark/ToolbarFilterButton";
import DatePickerDialog from "../../components/DatePickerDialog";
import SaveAndRemoveEarmarkDialog from "../earmark/SaveAndRemoveEarmarkDialog";
import FrozenAccountUpdateDialog from "./FrozenAccountUpdateDialog";
import CustomButtonSmall from "../../components/CustomButtonSmall";
import AddDealerFreezeAccountDialog from "./AddDealerFreezeAccountDialog";
import { CurrencyCellRenderer } from "../../components/ColumnHeader";

export function FreezeUnfreezeDealer() {
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
  const [searchDealerQuery, setDealerSearchQuery] = useState(""); //useAtom(globalSearchText);
  const [filter, setFilter] = useState("");

  const [earmarkDetails, setearmarkDetails] = useState([]);
  const [gridHeight, setGridHeight] = useState(108); // Default height
  const [totalNoOfRows, setTotalNoOfRows] = useState(0); // Default height
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useAtom(globalSearchText);

  const [open, setOpen] = useState(false);
  const [accountDetailsToAdd, setAccountDetailsToAdd] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openSaveAndRemoveEarmarkDialog, setOpenSaveAndRemoveEarmarkDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useAtom(selectedItems);
 
 
  const [openSaveAndRemoveDialog, setOpenSaveAndRemoveDialog] = useState(false);

  const [openAddEarmarkDialog, setOpenAddEarmarkDialog] = useState(false);

  const [selectedDealerName, setSelectedDealerName] = useState("");
  const [selectedDealerCode, setSelectedDealerCode] = useState("");

  const handleCloseSaveAndUnfreezeEarmarkDialog = () => {
    setOpenSaveAndRemoveDialog(false);
    DebugLog("Dialog Closed");
  };
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);

    //DateCalendarReferenceDate()
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // increase - decrease list layout height on available list itmes count
  function getDataGridHeight() {
    // Calculate the total height required for the grid
    const headerHeight = 100; // Height of header row
    const rowHeight = 100; // Height of each data row
    const rowCount = totalNoOfRows; // Total number of data rows
    const totalHeight = headerHeight + rowCount * rowHeight;

    // Set the grid height
    setGridHeight(totalHeight);
  }

  useEffect(() => {

    checkUserAuthExistOrNot();

    getDataGridHeight();

    showNoInternetSnackBar();

    navigate(blockNavigation);
  }, [isNetworkConnectionAvailable, enqueueSnackbar, navigate, totalNoOfRows]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    DebugLog("Dialog Closed");
  };

  const handlePageJump = (event) => {
    setCurrentPage(parseInt(event.target.value, 10) - 1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  function addNewEarmark() {
    setOpen(true);
  }


  function checkUserAuthExistOrNot() {
    if (getFromLocalStorage(SESSION_ID) === "") {
      navigate("/");
      return;
    }
  }
  
  const filteredRows = accountDetailsToAdd.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // get result from search query button update
  function addDealerSearchButtonClicked() {
    if(searchDealerQuery===""){
      alert("Please enter some value!")
    }
   else if(filter===""){
      getFreezeAccountDetailsToAdd(searchDealerQuery,"Company Name");
    // alert("Please select filter Type")
    } else {
      getFreezeAccountDetailsToAdd(searchDealerQuery,filter);
    }
    
  }


  const handleRowClick = (params) => {
    if (!params.row.freezeReason) {
       setSelectedItem(params.row);
       //setOpenSaveAndRemoveEarmarkDialog(true);
      //setSelectedItem(params.row);
      setOpenSaveAndRemoveDialog(true);
      //getEarmarkTimelineDetails(params)
    }
  };

  
  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  function addUpdateDealerFreezeStatus() {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true);

        const requestObject = {
          // pageNumber: 0,
          // pageSize: 100,
          // sortBy:'name',
          // sortOrder:'ASC',
          accountCode: "",
          vendorCode: "",
          //accountName:'',
          accountName: "Sanity PDC Testing",
        };

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_FREEZE_ACCOUNT_DEALER_LIST
        ).then((encryptedContentData) => {
          const requestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          getAccountDetailsToAdd(requestData)
            .then((response) => {
              // setAccountDetailsToAdd(response.data.result.totalFrozen)
              const contentData = response.data.result.accountList.map(
                (row) => ({
                  ...row,
                  id: generateRandomId(),
                })
              );
              setAccountDetailsToAdd(contentData);
              setTotalNoOfRows(response.data.result.accountList.length);
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

  function getFreezeAccountDetailsToAdd(searchQuery,filterName) {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true);
        let companyCode = ""
        let vendorCode = ""
        let companyName = ""
      
        if(filterName==="Name"){
          companyName = searchQuery
        }else if(filterName==="Dealer Code"){
          companyCode = searchQuery
        }else if(filterName==="Vendor Code"){
          vendorCode = searchQuery
        }else if(filterName==="Status"){
          companyName = searchQuery
        }
        else{
          companyName = searchQuery
        }


        // object.put("companyName","Sanity PDC Testing");
        // object.put("companyCode","");
        // object.put("vendorCode","");


        
        const requestObject = {
          // pageNumber: 0,
          // pageSize: 100,
          // sortBy:'name',
          // sortOrder:'ASC',
          companyCode: companyCode,
          vendorCode: vendorCode,
          companyName:companyName,
         // companyName: "Sanity PDC Testing",
        };

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.GET_FREEZE_ACCOUNT_DEALER_LIST
        ).then((encryptedContentData) => {
          const requestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          getAccountDetailsToAdd(requestData)
            .then((response) => {
              // setAccountDetailsToAdd(response.data.result.totalFrozen)
              const responseData = response.data.result.accountList.map(
                (row) => ({
                  ...row,
                  id: generateRandomId(),
                })
              );
              setAccountDetailsToAdd(responseData);
              setTotalNoOfRows(response.data.result.accountList.length);
              setLoading(false);
              // if(responseData.length==0){
              //   alert("No Record Found,Please try again with different search!")
              // }
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
        setProgressbarText(PROCESSING_PLEASE_WAIT);
        setLoading(true);
        // "accountCode": "string",
        // "accountName": "string",
        // "actionStatus": "string",
        // "bankAccountNumber": "string",
        // "bankName": "string",
        // "freezeReason": "string",
        // "pic": "string",
        // "status": "string",
        // "unFreezeReason": "string"
        const requestObject = {
          //{"accountCode":"A7124","actionStatus":"1","unFreezeReason":"incentive paid"}

          accountName: updatedValue.company,
          accountCode: updatedValue.code,
          vendorCode:updatedValue.vendorCode,
          //unFreezeReason: updatedValue.frozenReason,
          freezeReason: updatedValue.frozenReason,
          pic:updatedValue.pic,
          bankAccountNumber:updatedValue.accountNo,
          bankName:updatedValue.bank,
           //status:params.status
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
          ApiType.ADD_FREEZED_ACCOUNT
        ).then((encryptedContentData) => {
          const requestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          addFreezeAccount(requestData)
            .then((response) => {
              setLoading(false);
              showErrorAlert("UPDATED", "Freeze account details updated Successfully.");
              //getFreezeAccountDetailsData(); // load list again
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
    setOpenSaveAndRemoveDialog(false)
    // try {
    //   if (isNetworkConnectionAvailable) {
    //     setProgressbarText(LOADING_PLEASE_WAIT);
    //     setLoading(true);

    //     const requestObject = {
    //       accountCode: updatedValue.code,
    //       actionStatus: "1",
    //       unFreezeReason: updatedValue.frozenReason,
         
    //     };

    //     initializeEncryption(
    //       requestObject,
    //       getFromLocalStorage(MESSAGE_KEY),
    //       ApiType.GET_EARMARKS_DETAILS
    //     ).then((encryptedContentData) => {
    //       const requestData = {
    //         requestId: generateRequestId(),
    //         loginId: getFromLocalStorage(LOGIN_ID),
    //         sessionId: getFromLocalStorage(SESSION_ID),
    //         contentData: encryptedContentData,
    //       };

    //       unFreezeAccountDetails(requestData)
    //         .then((response) => {
             
    //           setLoading(false);
    //           showErrorAlert("UNFREEZED", "Account un-freezed successfully.");
    //         })
    //         .catch((error) => {
    //           if (error.data.errorCode === ApiErrorCode.SESSION_ID_NOT_FOUND) {
    //             try {
    //               navigate("/");
    //             } catch (error) {
    //               DebugLog("error " + error);
    //             }
    //           } else if (
    //             error.data.errorCode === ApiErrorCode.UNABLE_TO_PROCESS_ERROR
    //           ) {
    //             try {
    //               navigate(CONSTANT.FINANCE_DASHBOARD);
    //             } catch (error) {
    //               DebugLog("error " + error);
    //             }
    //           } else {
    //             const message =
    //               error.response != null
    //                 ? error.displayErrorMessage
    //                 : "Unknown";

    //             if (message)
    //               showErrorAlert(
    //                 error.message,
    //                 ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
    //               );
    //           }
    //         });
    //     });
    //   } else {
    //     showErrorAlert(ALERT, NO_INTERNET_CONNECTION_FOUND);
    //   }
    // } catch (error) {
    //   const message = error.response != null ? error.response : error.message;
    //   showErrorAlert(
    //     error.message,
    //     ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
    //   );
    // }
  }

  const renderButton = (rowData) => {
    return <CustomButtonSmall
    btnBG={colors.primary[100]}
    btnColor={colors.grey[900]}
    btnTxt={"Freeze"}
    btnBorder={"1px solid"+colors.primary[100]}
    onClick={() => handleAddFreezeAccountClick(rowData)}
    ></CustomButtonSmall>
  };

  const handleAddFreezeAccountClick = (rowData) => {

    DebugLog("row data"+JSON.stringify(rowData))
    setSelectedDealerName(rowData.name);
    setSelectedDealerCode(rowData.code);
    setSelectedItem(rowData)
    setOpenSaveAndRemoveDialog(true);
   // setOpenAddEarmarkDialog(true);
    // addNewEarmark();
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
        {/* <AddEarmarkDialogInput open={open} onClose={handleClose} /> */}


        <AddEarmarkDialogInput
                  open={openAddEarmarkDialog}
                  onClose={handleClose}
                  dealerName={selectedDealerName}
                  onSubmit={addNewEarmark}
              />

        <ShowErrorAlertDialog
          status={getDialogStatus}
          title={title}
          content={content}
        />
          <AddDealerFreezeAccountDialog
            open={openSaveAndRemoveDialog}
            onClose={handleCloseSaveAndUnfreezeEarmarkDialog}
            onDialogButtonClick={requestUpdateFreezeAccountDetailsData}
            onDialogRemoveButtonClick={requestUnFreezeAccountDetailsData}
            data={selectedItem}
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
          {/* Header */}
          <Grid
            container
            direction={"row"}
            alignItems={"center"}
            mb={2}
            ml={2}
            mt={1}
          >
            <Grid item mr={2}>
              <IconButton href={CONSTANT.FREEZE_ACCOUNT_ROUTE} width={12}>
                <img src={"../../assets/common/Back.svg"} width={12} />
              </IconButton>
            </Grid>

            <Grid item>
              <Typography
                color={colors.grey[100]}
                fontWeight={"600"}
                variant="h3"
              >
                {"Add Dealer"}
              </Typography>
            </Grid>

            <Box position="absolute" right={30} top={100}>
              <Grid container direction={"row"} alignItems={"center"}>
                {/* SEARCH BAR */}
                <Box
                  backgroundColor={colors.grey[900]}
                  borderRadius="20px"
                  ml={5}
                  mr={2}
                >
                  <InputBase
                    sx={{ ml: 2, flex: 1 }}
                    placeholder="Search Dealer"
                    value={searchDealerQuery}
                    onChange={(e) => setDealerSearchQuery(e.target.value)}
                  />

                  <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon onClick={addDealerSearchButtonClicked} />
                  </IconButton>
                </Box>

                <ToolbarFilterButton
                  options={[
                    "Name",
                    "Dealer Code",
                    "Vendor Code",
                    "Status",
                    "Company",
                  ]}
                  defaultOption="Option 1"
                  onChange={handleFilterChange}
                />

                {/* <button onClick={handleOpenDialog}>Open Date Picker</button> */}
              </Grid>
            </Box>
          </Grid>

          <DatePickerDialog open={isDialogOpen} onClose={handleCloseDialog} />
          {/* Header */}

          {/* Greetings Header */}
          {/* <Grid container>
            <Grid item>
              <GreetingHeader name={"Add Dealer"}></GreetingHeader>
            </Grid>
          </Grid> */}
          {/* Greetings Header */}

          {/* Highlight Stats */}
          {/* <HighlightStats
            highlightTotal={"100,000"}
            highlight1={"Dealers"}
            highlight1Stat={"4"}
            highlight2={"Device Reimburse"}
            highlight2Stat={"RM 100"}
            highlight3={"Incentives"}
            highlight3Stat={"RM 31.47"}
          ></HighlightStats> */}
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

            {accountDetailsToAdd.length > 0 ? (
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
                  columns={FreezeAccountAddDealerColumnHeader(
                    renderButton
                )}
                  components={{ Toolbar: GridToolbar }}
                  //checkboxSelection
                  //selecion
                  pageSize={pageSize}
                  rowCount={filteredRows.length}
                  pagination
                  onPageChange={handlePageChange}
                 // onRowClick={handleRowClick}
                />
              </Box>
            ) : (
              NoDataFound()
             
            )}
          </Grid>

          {accountDetailsToAdd.length > 0 ? (
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

          {/* {accountDetailsToAdd.length > 0 ? (
            <Grid item mt={1} justifyContent={"flex-start"} pb={10}>
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
          )} */}
          {/* Action Buttons */}

          {/* activity list */}
          {/* <UserActivityInfo/> */}
          {/* activity list */}
        </Grid>
      </SnackbarProvider>
    </Box>
    /* Main Container */
  );
}

export const FreezeAccountAddDealerColumnHeader = (renderButton) => [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "accountName",
    headerName: "NAME",
    flex: 1.5,
    cellClassName: "bold-column--cell",
    headerAlign: "left",
  },

  {
    field: "accountCode",
    headerName: "CODE",
    flex: 1,
    headerAlign: "left",
  },

  {
    field: "vendorCode",
    headerName: "VENDOR",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "bankName",
    headerName: "BANK NAME",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "bankAccountNumber",
    headerName: "BANK A/C NUMBER",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: 'freezeReason',
    headerName: 'ACTIONS',
    flex: 1,
    headerAlign: 'left',
    renderCell: (params) => (
     !params.value 
     ? 
      renderButton(params.row)
      : <CurrencyCellRenderer value={params.row.freezeReason} />
    ),
    },
  // {
  //   field: "action",
  //   headerName: "Actions",
  //   width: 150,
  //   headerAlign: "left",
  //   renderCell: (params) => (
  //     <CustomButton
  //       btnBG={colors.pink[700]}
  //       btnColor={colors.grey[100]}
  //       btnTxt={"FREEZE"}
  //       onClick={() => freezeAccountButtonClick(params.row.id)}
  //     ></CustomButton>
  //   ),
  // },
];

export const freezeAccountButtonClick = (id) => {
  alert("button click");
  // Handle button click action here
  console.log("Button clicked for row with ID:", id);
};

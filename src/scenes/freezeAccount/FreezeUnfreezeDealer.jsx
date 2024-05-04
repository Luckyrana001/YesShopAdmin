import { Avatar, IconButton, Typography, colors } from "@mui/material";

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
import { getAccountDetailsToAdd, getEarMarkDetails } from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import NoDataFound from "../../components/NoDataFound";
import { ApiErrorCode, ApiType } from "../../services/ApiTags";
import UserActivityInfo from "../../components/UserActivity";
import { initializeEncryption } from "../../services/AesGcmEncryption";
import AddEarmarkDialogInput from "../earmark/AddEarmarkDialog";

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

  const [earmarkDetails, setearmarkDetails] = useState([]);
  const [gridHeight, setGridHeight] = useState(108); // Default height
  const [totalNoOfRows, setTotalNoOfRows] = useState(0); // Default height
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useAtom(globalSearchText);

  const [open, setOpen] = useState(false);
  const [accountDetailsToAdd, setAccountDetailsToAdd] = useState([]);
 

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

    getFreezeAccountDetailsToAdd();

    showNoInternetSnackBar();

    navigate(blockNavigation);
  }, [isNetworkConnectionAvailable, enqueueSnackbar, navigate, totalNoOfRows]);
 
  const handleOpen = () => {
    setOpen(true);
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

  function addNewEarmark(){
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



function getFreezeAccountDetailsToAdd() {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true); 
  
        const requestObject = {
          // pageNumber: 0,
          // pageSize: 100,
          // sortBy:'name',
          // sortOrder:'ASC',
          accountCode: '',
          vendorCode:'',
          //accountName:'',
          accountName:"Sanity PDC Testing"
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
              const contentData = response.data.result.accountList.map((row) => ({
                ...row,
                id: generateRandomId(),
              }));
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

 {/* Header */}
 <Grid container direction={"row"} alignItems={"center"} mb={2} ml={2}>
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
              {
                "Add Dealer"
              }
            </Typography>
          </Grid>
        </Grid>
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
                  columns={FreezeAccountAddDealerColumnHeader}
                  components={{ Toolbar: GridToolbar }}
                  //checkboxSelection
                  //selecion
                  pageSize={pageSize}
                  rowCount={filteredRows.length}
                  pagination
                  onPageChange={handlePageChange}
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




export const FreezeAccountAddDealerColumnHeader = [
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
      field: 'action',
      headerName: 'Actions',
      width: 150,
      headerAlign: "left",
      renderCell: (params) => (
          <CustomButton
                    btnBG={colors.pink[700]}
                    btnColor={colors.grey[100]}
                   
                    btnTxt={"FREEZE"}
                    onClick= {() => freezeAccountButtonClick(params.row.id)}
                
                  ></CustomButton>
  
      ),
    },
  ];
  
export const freezeAccountButtonClick = (id) => {

    alert("button click")
    // Handle button click action here
    console.log('Button clicked for row with ID:', id);
  };
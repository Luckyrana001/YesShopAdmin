import { Avatar, IconButton, InputBase, Typography, paginationItemClasses } from "@mui/material";

import { Box, useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import { tokens } from "../../theme";
import GreetingHeader from "../../components/GreetingHeader";
import CustomButton from "../../components/CustomButton";
import CustomButtonSmall from "../../components/CustomButtonSmall";
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
import SearchIcon from "@mui/icons-material/Search";

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
  LOADING_FILTER_DETAILS_PLEASE_WAIT,
  ADDING_EARMARK,
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

// API Services
import { 
  getEarMarkDetails,
  getEarMarkFilterDetailsAPI,
  getAllAccountsEarMarkDetails,
  addEarmarkDetails,
  updateEarMarkDetails,
  deleteEarMarkDetails,
  getEarMarkTimelineDetails,
 } from "../../services/ApiService";

import { useNavigate } from "react-router-dom";
import { allAccountsEarmarkColumnHeader } from "../../components/ColumnHeader";
import NoDataFound from "../../components/NoDataFound";
import { ApiErrorCode, ApiType } from "../../services/ApiTags";
import UserActivityInfo from "../../components/UserActivity";
import { initializeEncryption } from "../../services/AesGcmEncryption";
import AddEarmarkDialogInput from "./AddEarmarkDialog";
import SaveAndRemoveEarmarkDialog from "./SaveAndRemoveEarmarkDialog";
import ToolbarFilterButton from "./ToolbarFilterButton";

export function AddDealerScreen() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const isNetworkConnectionAvailable = UseOnlineStatus();

  // filterCriteria is fetched from API and has the structure of [{ "displayName": "NAME", "paramName": "accountName" }]
  const [filter, setFilter] = useState("");
  const [filterCriteria, setFilterCriteria] = useState([{ "keyValue":"","displayName": "", "paramName": "" }]);
  const [filterDisplayOptions, setFilterDisplayOptions] = useState([]);
  const [defaultFilter, setDefaultFilter] = useState("Name");

  const [getDialogStatus, setErrorDialog] = useAtom(showErrorAlertDialog);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(ALERT);
  const [content, setContent] = useState("");
  const [, setError] = useState("");
  const [getProgressbarText, setProgressbarText] = useState("");

  const [earmarkDetails, setEarmarkDetails] = useState([]);
  const [gridHeight, setGridHeight] = useState(108); // Default height
  const [totalNoOfRows, setTotalNoOfRows] = useState(0); // Default height
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalNoOfPages, setTotalNoOfPages] = useState(0);

  const [searchQueryPlaceholder, setSearchQueryPlaceholder] = useState("Search Name");
  const [searchQuery, setSearchQuery] = useAtom(globalSearchText);

  const [searchDealerQuery, setDealerSearchQuery] = useState(""); //useAtom(globalSearchText);

  // Add Earmark Dialog
  const [openAddEarmarkDialog, setOpenAddEarmarkDialog] = useState(false);
  const [selectedDealerName, setSelectedDealerName] = useState("");
  const [selectedDealerCode, setSelectedDealerCode] = useState("");

  // Save and Remove Earmark Dialog
  const [openSaveAndRemoveEarmarkDialog, setOpenSaveAndRemoveEarmarkDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useAtom(selectedItems);
  const [earmarkTimelineDetails, setearmarkTimelineDetails] = useState([]);

  // useEffect(() => {
  //   getDataGridHeight();
  //   }, [pageSize]);

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
    const totalHeight = headerHeight + (rowCount+1) * rowHeight;

    // Set the grid height
    setGridHeight(totalHeight);
  }
  
  // call only on the first time page is rendered
  useEffect(() => {
    getEarMarkFilterDetails();
  }, []);

  useEffect(() => {
    checkUserAuthExistOrNot();

    getDataGridHeight();

    showNoInternetSnackBar();

    navigate(blockNavigation);
  }, [isNetworkConnectionAvailable, enqueueSnackbar, navigate, totalNoOfRows]);

  // create useEffect to clear search query when a new filter is selected
  useEffect(() => {
    const placeholder = "Search " + filter.displayName;
    setSearchQueryPlaceholder(placeholder);
    // setSearchQuery("");
  }, [filter]);

  const handleOpen = () => {
    setOpenAddEarmarkDialog(true);
  };
  const handleFilterChange = (filter) => {
    // find the right filterCriteria based on the selected filter
    const selectedFilter = filterCriteria.find((item) => item.displayName === filter);
    setFilter(selectedFilter);

  };

  const handleClose = () => {
    setOpenAddEarmarkDialog(false);
    DebugLog("Dialog Closed");
  };
  
  const handleCloseSaveAndRemoveEarmarkDialog = () => {
    setOpenSaveAndRemoveEarmarkDialog(false);
    DebugLog("Dialog Closed");
  };

  const handlePageJump = (event) => {
    setCurrentPage(parseInt(event.target.value, 10) - 1);
    searchAllAccountEarmarkDetails(currentPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    searchAllAccountEarmarkDetails(currentPage);
  };

  
  const renderButton = (rowData) => {
    return <CustomButtonSmall
    btnBG={colors.primary[100]}
    btnColor={colors.grey[900]}
    btnTxt={"Add Earmark"}
    btnBorder={"1px solid"+colors.primary[100]}
    onClick={() => handleAddNewEarmarkClick(rowData)}
    ></CustomButtonSmall>
  };

  const handleAddNewEarmarkClick = (rowData) => {
    setSelectedDealerName(rowData.name);
    setSelectedDealerCode(rowData.code);
    setOpenAddEarmarkDialog(true);
    // addNewEarmark();
  };

  // function to add earmark details for new dealers
  async function addNewEarmark(formData) {
    try {
      if (!isNetworkConnectionAvailable) {
        throw new Error(NO_INTERNET_CONNECTION_FOUND);
      }

      setProgressbarText(ADDING_EARMARK);
      setLoading(true);

      const contentData = {
        accountCode: selectedDealerCode,
        accountName: selectedDealerName,
        earmarkAmount: formData.earmark,
        reason: formData.reason,
        transactionDate: null,
        fromDate: null,
        toDate: null,
        pageNumber: null, 
        pageSize: null,
        sortOrder: null,
        sortProperty: null,
        vendorCode: null
      };

      const encryptedContentData = await initializeEncryption(
        contentData,
        getFromLocalStorage(MESSAGE_KEY),
        ApiType.ADD_EARMARK_DETAILS
      );
  
      const requestData = {
        requestId: generateRequestId(),
        loginId: getFromLocalStorage(LOGIN_ID),
        sessionId: getFromLocalStorage(SESSION_ID),
        contentData: encryptedContentData,
      };

      // Call the API to get filter criteria
      addEarmarkDetails(requestData)
      .then((response) => {
        setLoading(false);
        showErrorAlert("SUCCESS", "Earmark added successfully.");
        
        // load list again
        setCurrentPage(0);
        searchAllAccountEarmarkDetails(currentPage);

        // navigate back to earmark page
        // navigate(CONSTANT.EARMARK_ROUTE);
      }).catch((error) => {
        handleError(error);
      });

    } catch (error) {
      console.log("Error while adding earmark: ", error);
      handleError(error);
    }
  }

  function addDealerSearchButtonClicked() {
    searchAllAccountEarmarkDetails(currentPage);
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


  const handleRowClick = (params) => {
    if (!params.row.addButton) {
      setSelectedItem(params.row);
      setOpenSaveAndRemoveEarmarkDialog(true);
      getEarmarkTimelineDetails(params)
    }
  };

  // update existing earmark details 
  function requestUpdateEarMarkDetailsData(params,earmarkValue,reasonValue) {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true);

        const requestObject = {
          accountCode: params.code,
          transactionDate: params.date,
          earmarkAmount: earmarkValue,
          // fromDate: params.fromDate,
          // toDate: params.toDate,
          accountName: params.name,
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
              // load list again
              setCurrentPage(0);
              searchAllAccountEarmarkDetails(currentPage);
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

  // remove existing earmark details data
  function requestDeleteEarMarkDetailsData(params) {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true);

        const requestObject = {
          accountCode: params.code,
          transactionDate: params.date,
          earmarkAmount: params.earmark,
          // fromDate: params.fromDate,
          // toDate: params.toDate,
          accountName: params.name,
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

              // load list again
              setCurrentPage(0);
              searchAllAccountEarmarkDetails(currentPage);
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

  function getEarmarkTimelineDetails(params) {
    try {
      if (isNetworkConnectionAvailable) {
        //setProgressbarText(LOADING_PLEASE_WAIT);
        // setLoading(true);

        const requestObject = {
          accountCode: params.code,
          transactionDate: params.date,
          earmarkAmount: params.earmark,
          // fromDate: params.fromDate,
          // toDate: params.toDate,
          accountName: params.name,
          reason: params.reason,

          // pageNumber: 0,
          // pageSize: 100,
          // name: "Ghe Network",
          // date: "2024-05-04 17:48:00.0",
          // code: "A00010001AC",
          // vendor: "00004",
          // reason: "Negative Balance",
          // earmark: "5000",
        };

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.EARMARK_DETAILS_AUDIT
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

  // create a function to call api getEarMarkFilterDetails to get filter criteria for the dropdown
  async function getEarMarkFilterDetails() {
    try {
      if (!isNetworkConnectionAvailable) {
        throw new Error(NO_INTERNET_CONNECTION_FOUND);
      }

      setProgressbarText(LOADING_FILTER_DETAILS_PLEASE_WAIT);
      setLoading(true);

      const requestObject = {};

      const encryptedContentData = await initializeEncryption(
        requestObject,
        getFromLocalStorage(MESSAGE_KEY),
        ApiType.EARMARK_FILTER_DETAILS
      );
  
      const requestData = {
        requestId: generateRequestId(),
        loginId: getFromLocalStorage(LOGIN_ID),
        sessionId: getFromLocalStorage(SESSION_ID),
        contentData: encryptedContentData,
      };

      // Call the API to get filter criteria
      getEarMarkFilterDetailsAPI(requestData)
      .then((response) => {
        // Set the filter criteria in the state
        setFilterCriteria(response.data.result);
        setFilterDisplayOptions(response.data.result.map((item) => item.displayName));
        setDefaultFilter(response.data.result[0].displayName);
        setFilter(response.data.result[0]);
        setLoading(false);
      }).catch((error) => {
        handleError(error);
      });

    } catch (error) {
      handleError(error);
    }
  }

  // search accounts after user click search button
  function searchAllAccountEarmarkDetails(pageNumber) {
    try {
      if (isNetworkConnectionAvailable) {
        setProgressbarText(LOADING_PLEASE_WAIT);
        setLoading(true);

        const requestObject = createRequestObject(pageNumber, filter, searchDealerQuery);

        initializeEncryption(
          requestObject,
          getFromLocalStorage(MESSAGE_KEY),
          ApiType.ALL_ACCOUNTS_EARMARK_DETAILS
        ).then((encryptedContentData) => {
          const requestData = {
            requestId: generateRequestId(),
            loginId: getFromLocalStorage(LOGIN_ID),
            sessionId: getFromLocalStorage(SESSION_ID),
            contentData: encryptedContentData,
          };

          getAllAccountsEarMarkDetails(requestData)
            .then((response) => {
              setLoading(false);
              const contentData =
                response.data.result.allAccountEarmarkDetails.content.map((row) => ({
                  ...row,
                  id: generateRandomId(),
                }));
              setEarmarkDetails(contentData);
              setTotalNoOfRows(response.data.result.allAccountEarmarkDetails.content.length);
              setTotalNoOfPages(response.data.result.allAccountEarmarkDetails.totalPages);
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

          setLoading(false);
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

  // Create Request Object for searchAllAccountEarmarkDetails API
  function createRequestObject(pageNumber, selectedFilter, filterValue) {
    // Initialize all fields to null
    let requestObject = {
      accountCode: null,
      earmarkAmount: null,
      accountName: null,
      pageNumber: pageNumber,
      pageSize: pageSize,
      reason: null,
      sortOrder: null,
      sortProperty: null,
      vendorCode: null
    };
  
    // Set the appropriate field based on filterCriteria
    if (selectedFilter != null && selectedFilter != undefined && selectedFilter.paramName != "") {
      requestObject[selectedFilter.paramName] = filterValue;
    }

    return requestObject;
  }

  // handle error code reusable block
  function handleError(error) {
    setLoading(false);
    console.log("Error handled: ", error);

    if (error.message === NO_INTERNET_CONNECTION_FOUND) {
      // Handle no internet connection error
      showErrorAlert(ALERT, NO_INTERNET_CONNECTION_FOUND);
      return;
    } 

    const errorCode = error.data?.errorCode;
    var errorMessage =
        error.response != null
            ? error.displayErrorMessage
            : 'Unknown';
    if (error.data?.displayErrorMessage) {
      errorMessage = error.data.displayErrorMessage;
    }

    const errorActions = {
      [ApiErrorCode.SESSION_ID_NOT_FOUND]: () => navigate("/"),
      [ApiErrorCode.UNABLE_TO_PROCESS_ERROR]: () => navigate(CONSTANT.FINANCE_DASHBOARD),
      default: () => showErrorAlert(
        error.message,
        ERROR_WHILE_FETCHING_DATA + JSON.stringify(errorMessage)
      ),
    };
  
    (errorActions[errorCode] || errorActions.default)();
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

              <SaveAndRemoveEarmarkDialog
                  open={openSaveAndRemoveEarmarkDialog}
                  onClose={handleCloseSaveAndRemoveEarmarkDialog}
                  onDialogButtonClick={requestUpdateEarMarkDetailsData}
                  onDialogRemoveButtonClick={requestDeleteEarMarkDetailsData}
                  data={selectedItem}
                  earmarkTimeline={earmarkTimelineDetails}
              />

              {isNetworkConnectionAvailable ? (
                  <CustomProgressDialog
                      open={loading}
                      text={getProgressbarText}
                  />
              ) : (
                  showNoInternetSnackBar()
              )}
              <Grid
                  container
                  component="main"
                  direction={'column'}
                  sx={{
                      // height: "100vh",
                      m: '0 2.5%' /* Approx 30px */,
                      borderRadius: '18px',
                  }}
              >
                  {/* Header */}
                  <Grid
                      container
                      direction={'row'}
                      alignItems={'center'}
                      mb={2}
                      ml={2}
                      mt={1}
                  >
                      <Grid item mr={2}>
                          <IconButton href={CONSTANT.EARMARK_ROUTE} width={12}>
                              <img
                                  src={'../../assets/common/Back.svg'}
                                  width={12}
                              />
                          </IconButton>
                      </Grid>

                      <Grid item>
                          <Typography
                              color={colors.grey[100]}
                              fontWeight={'600'}
                              variant="h3"
                          >
                              {'Add Dealer'}
                          </Typography>
                      </Grid>

                      <Box position="absolute" right={30} top={100}>
                          <Grid
                              container
                              direction={'row'}
                              alignItems={'center'}
                          >
                              {/* SEARCH BAR */}
                              <Box
                                  backgroundColor={colors.grey[900]}
                                  borderRadius="20px"
                                  ml={5}
                                  mr={2}
                              >
                                  <InputBase
                                      sx={{ ml: 2, flex: 1 }}
                                      placeholder={searchQueryPlaceholder}
                                      value={searchDealerQuery}
                                      onChange={(e) =>
                                          setDealerSearchQuery(e.target.value)
                                      }
                                  />

                                  <IconButton type="button" sx={{ p: 1 }}>
                                      <SearchIcon
                                          onClick={addDealerSearchButtonClicked}
                                      />
                                  </IconButton>
                              </Box>

                              <ToolbarFilterButton
                                  options={filterDisplayOptions}
                                  defaultOption={defaultFilter}
                                  onChange={handleFilterChange}
                              />
                          </Grid>
                      </Box>
                  </Grid>
                  {/* Header */}

                  {/* On Hold Section */}
                  <Grid
                      container
                      mt={3}
                      border={'1px solid' + colors.grey[600]}
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
                                  '& .MuiDataGrid-root': {
                                      border: 'none',
                                  },
                                  '& .MuiDataGrid-cell': {
                                      borderBottom: 'none',
                                  },
                                  '& .name-column--cell': {
                                      color: colors.redAccent[200],
                                      fontWeight: 'bold',
                                      fontSize: 13,
                                  },
                                  '& .MuiDataGrid-columnHeaders': {
                                      backgroundColor: 'rgba(255,255,255,0.6)',
                                      borderBottom: 'none',
                                      fontWeight: 'bold',
                                      fontSize: '13px',
                                      color: `${colors.grey[300]} !important`,
                                  },
                                  '& .MuiDataGrid-virtualScroller': {
                                      background: 'rgba(255,255,255,1)',
                                  },
                                  '& .MuiDataGrid-footerContainer': {
                                      borderTop: 'none',
                                      backgroundColor: 'rgba(255,255,255,0.6)',
                                  },
                                  '& .MuiCheckbox-root': {
                                      //color: `${colors.white[200]} !important`,
                                  },
                                  '& .MuiDataGrid-toolbarContainer .MuiButton-text':
                                      {
                                          //  color: `${colors.grey[100]} !important`,
                                          //backgroundColor: "rgba(255,255,255,0.6)",
                                          // opacity:.5
                                      },
                              }}
                          >
                              <DataGrid
                                  // rows={filteredRows.slice(
                                  //   currentPage * pageSize,
                                  //   (currentPage + 1) * pageSize
                                  // )}
                                  rows={earmarkDetails}
                                  columns={allAccountsEarmarkColumnHeader(
                                      renderButton
                                  )}
                                  components={{ Toolbar: GridToolbar }}
                                  checkboxSelection={false}
                                  selecion
                                  pageSize={pageSize}
                                  rowCount={totalNoOfRows}
                                  pagination
                                  onPageChange={handlePageChange}
                                  onRowClick={handleRowClick}
                              />
                          </Box>
                      ) : (
                          NoDataFound()
                      )}
                  </Grid>

                  {earmarkDetails.length > 0 ? (
                      <Box>
                          <Typography>
                              <span>Jump to page: </span>
                              <select
                                  value={currentPage + 1}
                                  onChange={handlePageJump}
                              >
                                  {[...Array(totalNoOfPages)].map(
                                      (_, index) => (
                                          <option key={index} value={index + 1}>
                                              {index + 1}
                                          </option>
                                      )
                                  )}
                              </select>
                          </Typography>
                      </Box>
                  ) : (
                      ''
                  )}
                  <UserActivityInfo />
              </Grid>
          </SnackbarProvider>
      </Box>
      /* Main Container */
  );
}

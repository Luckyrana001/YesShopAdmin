import { generateBasicAuthHeader } from "./BasicAuthHashing";
import { AUTHORIZATION } from "../constants/Constant";
import DebugLog from "../utils/DebugLog";
import { axiosInstance } from "./AxiosIntercepter";
import { getFromLocalStorage } from "../utils/localStorageUtils";
import { USER_ROLE } from "../constants/LocalStorageKeyValuePairString";

// get Basic auth
export const getBasicAuth = (includeAuthorizationHeader) => {
  let headers = {};
  if (includeAuthorizationHeader) {
    const headerTokken = generateBasicAuthHeader();
    const authToken = "BASIC " + headerTokken;
    //const authToken = "BASIC " + "eW1jYXVzZXI6MnhKeHp3RUdzaDNTNFF2RUMvZWRwZz09";
    DebugLog("authToken====" + authToken);
    headers[AUTHORIZATION] = authToken;
  }
  return axiosInstance.get(process.env.REACT_APP_BASIC_AUTH_API_URL, {
    headers,
  });
};

// get user login details
export const getUserLoginDetails = (reqestParams) => {
  return axiosInstance.post(process.env.REACT_APP_LOGIN_API_URL, reqestParams);
};

// create dummy user
export const createUser = (reqestParams) => {
  return axiosInstance.post("/users", reqestParams);
};

// get payout details
export const getPayoutDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_PAYOUT_DETAILS_API_URL,
    reqestParams
  );
};
// get payout all transaction details
export const getPayoutAllTransactions = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_GET_ALL_PAYOUT_TRANSACTION_LIST_API_URL,
    reqestParams
  );
};

// get payout/getAllPayoutList
export const getAllPayoutList = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_GET_ALL_PAYOUT_LIST_API_URL,
    reqestParams
  );
};

// get payout summary
export const getPayoutSummary = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_PAYOUT_SUMMARY_API_URL,
    reqestParams
  );
};

// get payout summary
export const holdPayoutTransaction = (reqestParams) => {
  if (getFromLocalStorage(USER_ROLE) === "Biz Ops") {
    return axiosInstance.post(
      process.env.REACT_APP_HOLD_PAYOUT_TRANSACTION_API_URL,
      reqestParams
    );
  } else {
    return axiosInstance.post(
      process.env.REACT_APP_HOLD_PAYOUT_COMPANY_API_URL,
      reqestParams
    );
  }
};

//  payout request approval
export const payoutRequestApproval = (reqestParams) => {
  if (getFromLocalStorage(USER_ROLE) === "Biz Ops") {
    return axiosInstance.post(
      process.env.REACT_APP_HOLD_PAYOUT_REQUEST_APPROVAL_API_URL,
      reqestParams
    );
  } else {
    return axiosInstance.post(
      process.env.REACT_APP_HOLD_PAYOUT_COMPANY_APPROVE_API_URL,
      reqestParams
    );
  }
};

//  payout request approval
export const payoutApproval = (reqestParams) => {
  //if(getFromLocalStorage(USER_ROLE)==='Biz Ops'){
  return axiosInstance.post(
    process.env.REACT_APP_HOLD_PAYOUT_COMPANY_REQUEST_APPROVAL_API_URL,
    reqestParams
  );
  // }else {
  //   return axiosInstance.post(process.env.REACT_APP_HOLD_PAYOUT_COMPANY_REQUEST_APPROVAL_API_URL, reqestParams);
  // }
};

// get on-hold summary
export const getOnHoldDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_ON_HOLD_DETAILS_API_URL,
    reqestParams
  );
};

// get on-hold details
export const getOnHoldSummary = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_ON_HOLD_SUMMARY_API_URL,
    reqestParams
  );
};

// get earMarks details
export const getEarMarkDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_GET_EARMAKR_DETAILS_API_URL,
    reqestParams
  );
};


// update earMarks details
export const updateEarMarkDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_UPDATE_EARMAKR_DETAILS_API_URL,
    reqestParams
  );
};

// update freeze account details
export const updateFreezeAccountDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_UPDATE_FREEZE_ACCOUNT_DETAILS_API_URL,
    reqestParams
  );
};


// update freeze account details
export const unFreezeAccountDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_UPDATE_FREEZE_ACCOUNT_DETAILS_API_URL,
    reqestParams
  );
};



// update earMarks details
export const deleteEarMarkDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_DELETE_EARMAKR_DETAILS_API_URL,
    reqestParams
  );
};


// get earMarks timeline details
export const getEarMarkTimelineDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_GET_EARMAKR_TIMELINE_DETAILS_API_URL,
    reqestParams
  );
};


// get earMarks activity details
export const getEarmarkActivityDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_GET_EARMAKR_ACTIVITY_DETAILS_API_URL,
    reqestParams
  );
};

// get earMarks  details summary top bar
export const getEarmarkDetailsSummaryTopBarItems = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_GET_EARMAKR_DETAILS_SUMMARY_API_URL,
    reqestParams
  );
};


// get earMarks details
export const getCreditDebitDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_DEBIT_CREDIT_API_URL,
    reqestParams
  );
};

// get freeze account details
export const getFreezeAccountList = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_GET_FREEZ_ACCOUNT_DETAILS_API_URL,
    reqestParams
  );
};



// get freeze account details
export const updateAccountDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_UPDATE_FREEZE_ACCOUNT_DETAILS_API_URL,
    reqestParams
  );
};


// get freeze account details to add new account to freeze
export const getAccountDetailsToAdd = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_GET_FREEZE_ACCOUNT_DETAILS_TO_ADD_API_URL,
    reqestParams
  );
};



// get on-hold Company
export const getOnHoldCompany = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_ON_HOLD_COMPANY_API_URL,
    reqestParams
  );
};

// get on-hold Details
export const getOnHoldPayoutCycle = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_ON_HOLD_PAYOUT_CYCLE_API_URL,
    reqestParams
  );
};

// get onHold Company Payout Transaction
export const onHoldCompanyPayoutTransaction = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_ON_HOLD_COMMPANY_PAYOUT_TRANSACTIONS_API_URL,
    reqestParams
  );
};

// get on-hold details
export const getWitholdingTaxDetails = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_WITHOLDING_TAX_DETAILS_API_URL,
    reqestParams
  );
};

// get Payout dates
export const getPayoutDates = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_GET_PAYOUT_DATES_API_URL,
    reqestParams
  );
};

// get Exclusion Report
export const getExclusionReports = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_GET_EXCLUSION_LIST_API_URL,
    reqestParams
  );
};

// add Exclusion Report
export const addExclusionReports = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_ADD_EXCLUSION_API_URL,
    reqestParams
  );
};

// remove Exclusion Report
export const removeExclusionReports = (reqestParams) => {
  return axiosInstance.post(
    process.env.REACT_APP_REMOVE_EXCLUSION_API_URL,
    reqestParams
  );
};

import * as React from "react";
// import { ApiErrorCode } from "../services/ApiTags";
// import ShowErrorAlertDialog from "../components/ErrorAlertDialog";
// import DebugLog from "./DebugLog";
// import { useNavigate } from "react-router-dom";
// import { ERROR_WHILE_FETCHING_DATA } from "../constants/Strings";
// import { atom, useAtom } from "jotai";
// import { useEffect, useState } from "react";
// import {
//   alertBoxContent,
//   alertBoxTitle,
//   isAuthPageAtom,
//   loadingStatus,
//   showErrorAlertDialog,
// } from "../config/AppConfig";

// const [loading, setLoading] = useAtom(loadingStatus);
// const [title, setTitle] = useState(alertBoxTitle);
// const [content, setContent] = useState(alertBoxContent);
// const [getDialogStatus, setErrorDialog] = useAtom(showErrorAlertDialog);
// const [, setError] = useState("");
// const navigate = useNavigate();

export function showUiError(error) {
  // if(!error.errorCode===ApiErrorCode.SESSION_ID_NOT_FOUND) {
  //     const message =
  //     error.response != null ? error.displayErrorMessage : "";
  //   if(message)
  //   showErrorAlertDialog(
  //     error.message,
  //     ERROR_WHILE_FETCHING_DATA + JSON.stringify(message)
  //   );
  //   }else{
  //     navigate("/")
  //   }
}

export function showErrorAlert(title, content) {
  // try {
  //   setError();
  //   setLoading(false);
  //   setTitle(title);
  //   setContent(content);
  //   setErrorDialog(true);
  // } catch (error) {
  //   DebugLog(error);
  // }
}

//export default showUiError;

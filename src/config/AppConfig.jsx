import { atomWithStorage } from "jotai/utils";
import {
  COLLAPSE_MENU,
  DARK_MODE,
  ERROR_CONTENT,
  ERROR_TITLE,
  GET_DIALOG_DATA,
  GET_DIALOG_STATUS,
  GET_SESSION_ID_STATUS,
  GLOBAL_SEARCH,
  IS_AUTH_PAGE,
  NAVIGATION_DATA,
  NAVIGATION_PAYOUT_ALL_TRANSACTION_DATA,
  OPEN_SLIDING_MENU,
  PROGRESS_STATUS,
  SELECTED_TAB,
} from "../constants/Constant";
import { ALERT } from "../constants/Strings";

export const darkModeAtom = atomWithStorage(DARK_MODE, false);

export const openSlidingMenu = atomWithStorage(OPEN_SLIDING_MENU, true);
export const showErrorAlertDialog = atomWithStorage(GET_DIALOG_STATUS, false);
export const sessionIdStatus = atomWithStorage(GET_SESSION_ID_STATUS, "");
export const isAuthPageAtom = atomWithStorage(IS_AUTH_PAGE, true);
export const collapseMenu = atomWithStorage(COLLAPSE_MENU, true);
export const globalSearchText = atomWithStorage(GLOBAL_SEARCH, "");
export const selectedItems = atomWithStorage(GET_DIALOG_DATA, {});
export const selectedSidebarTab = atomWithStorage(SELECTED_TAB, "dashboard");

//Api and network error message
export const loadingStatus = atomWithStorage(PROGRESS_STATUS, true);
export const alertBoxTitle = atomWithStorage(ERROR_TITLE, ALERT);
export const alertBoxContent = atomWithStorage(ERROR_CONTENT, "");

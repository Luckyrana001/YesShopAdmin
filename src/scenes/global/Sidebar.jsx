import * as React from "react";
import { useEffect, useState } from "react";
import isEmptyArray from "lodash/isEmpty";
import SvgIcon from '@mui/material/SvgIcon';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Icon } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
// import { styled } from '@mui/material/styles';
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import {
  collapseMenu,
  isAuthPageAtom,
  openSlidingMenu,
  sessionIdStatus,
} from "../../config/AppConfig";
import { useAtom } from "jotai";
import { BackButtonListener } from "../../components/BackButtonListener";
import {
  ADJUSTMENT_ROUTE,
  CREDIT_DEBIT_ROUTE,
  EARMARK_ROUTE,
  EXCLUSION_ROUTE,
  FINANCE_DASHBOARD,
  FREEZE_ACCOUNT_ROUTE,
  ON_HOLD_ROUTE,
  PAYOUT_DATES_ROUTE,
  PAYOUT_ROUTE,
  REPORTS_ROUTE,
  VALIDATION_ROUTE,
  WITHOLDING_TAX_ROUTE,
} from "../../constants/Constant";

/* NEW ICONS */

// import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import DoNotDisturbAltOutlinedIcon from "@mui/icons-material/DoNotDisturbAltOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";

import { useContext } from "react";
import { SidebarContext } from "../../scenes/global/context/sidebarContext.jsx";
import {
  ADJUSTMENT,
  CREDIT_DEBIT,
  DASHBOARD,
  EARMARK,
  EXCLUSION,
  FREEZE_ACCOUNT,
  ON_HOLD,
  PAYOUT,
  PAYOUT_DATES,
  REPORTS,
  VALIDATIONS,
  WITHOLDING_TAX,
} from "../../constants/Strings.jsx";
import ValidationScreen from "../validations/index.jsx";
import {
  getFromLocalStorage,
  getFromLocalStorageJsonObject,
} from "../../utils/localStorageUtils.js";
import {
  LOGIN_RESPONSE,
  SESSION_ID,
} from "../../constants/LocalStorageKeyValuePairString.jsx";
import DebugLog from "../../utils/DebugLog.jsx";

const Item = ({ title, to, icon, selected, setSelected, visible }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // useEffect(() => {
  //   resetAllConfigration();

  //   const basicAuthTokken = getFromLocalStorage(BASIC_AUTH_TOKKEN);
  //   if (basicAuthTokken === undefined || basicAuthTokken === null)
  //     requestBasicAuth(false);

  //   showNoInternetSnackBar();
  // }, [sessionIdState]);

  return (
    <div>
      {visible && (
        <MenuItem
          active={selected === title}
          style={{
            color: colors.grey[200],
            // fontFamily: 'Montserrat Bold',
            // fontWeight: "900"
          }}
          onClick={() => setSelected(title)}
          icon={icon}
        >
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            {title}
          </Typography>
          <Link to={to} />
        </MenuItem>
      )}
    </div>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useAtom(collapseMenu);
  //const [isVisible, setIsVisible] = useAtom(false);

  const [selected, setSelected] = useState("Dashboard");
  const [isAuthPage, setAuthStatus] = useAtom(isAuthPageAtom);
  const [slidingMenuStatus, setSlidingMenu] = useAtom(openSlidingMenu);
  const [sessionIdState, setSessionIdState] = useAtom(sessionIdStatus);

  // menu hide / show logic
  const [Validations, setValidations] = useState(false);
  const [Formulas, setFormulas] = useState(false);
  const [Payout, setPayout] = useState(false);
  const [OnHold, setOnHold] = useState(false);
  const [Exclusions, setExclusions] = useState(false);
  const [PayoutDates, setPayoutDates] = useState(false);
  const [WithholdingTax, setWithholdingTax] = useState(false);
  const [Earmark, setEarmark] = useState(false);
  const [FreezeAccount, setFreezeAccount] = useState(false);
  const [DebitCredit, setDebitCredit] = useState(false);

  // reducer and context listening
  const [activeLinkIdx] = useState(3);
  const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext);

  useEffect(() => {
    // setIsVisible(openSlidingMenu)
    //setSlidingMenu(openSlidingMenu);
    // setIsCollapsed(openSlidingMenu)

    if (isSidebarOpen) {
      setSidebarClass("sidebar-change");
    } else {
      setSidebarClass("");
    }

    DebugLog(
      "getFromLocalStorage(SESSION_ID)    " + getFromLocalStorage(SESSION_ID)
    );
    const sessionId = getFromLocalStorage(SESSION_ID);
    try {
      if (sessionId !== "") {
        const userDetails = getFromLocalStorageJsonObject(LOGIN_RESPONSE);
        DebugLog("userDetails from sidebar    " + JSON.stringify(userDetails));

        let incentives = [];
        let adjustments = [];

        //const menuArray = userDetails
        DebugLog("menuList from sidebar    " + JSON.stringify(userDetails));
        if (!isEmptyArray(userDetails)) {
          DebugLog("userDetails.length  ==== " + userDetails.length);
          let menuListSize = userDetails.length;
          if (menuListSize != null && menuListSize > 0) {
            userDetails.forEach((item, index) => {
              if (item.menuListName === "Incentive") {
                incentives = [...item.menuItem];
              } else if (item.menuListName === "Adjustment") {
                adjustments = [...item.menuItem];
              }
            });

            DebugLog(
              "incentives from sidebar    " + JSON.stringify(incentives)
            );

            DebugLog(
              "adjustments from sidebar    " + JSON.stringify(adjustments)
            );

            setPayout(false);
            setOnHold(false);
            setExclusions(false);
            setPayoutDates(false);
            setWithholdingTax(false);
            setEarmark(false);
            setFreezeAccount(false);

            incentives.forEach((item, index) => {
              if (item.menuName === "Payout") {
                setPayout(true);
              } else if (item.menuName === "On Hold") {
                setOnHold(true);
              } else if (item.menuName === "Exclusions") {
                setExclusions(true);
              } else if (item.menuName === "Payout Dates") {
                setPayoutDates(true);
              } else if (item.menuName === "Withholding Tax") {
                setWithholdingTax(true);
              } else if (item.menuName === "Validations") {
                setEarmark(true);
              } else if (item.menuName === "Formulas") {
                setFreezeAccount(true);
              }
            });
            setEarmark(false);
            setFreezeAccount(false);
            setDebitCredit(false);
            adjustments.forEach((item, index) => {
              if (item.menuName === "Earmark") {
                setEarmark(true);
              } else if (item.menuName === "Freeze Account") {
                setFreezeAccount(true);
              } else if (item.menuName === "Debit/Credit") {
                setDebitCredit(true);
              }
            });
          }
        }
      }
    } catch (error) {
      DebugLog(error);
    }
  }, [isSidebarOpen, openSlidingMenu, collapseMenu, sessionIdState]);

  return (
    <div className={`sidebar ${sidebarClass}`}>
      {!isAuthPage ? (
        <Box
          alignItems={"space-around"}
          // visibility={isVisible}
          sx={{
            "& .pro-sidebar-inner": {
              background: `${colors.white[50]} !important`,
              fontFamily: "Montserrat-Bold",
            },
            "& .pro-icon-wrapper": {
              backgroundColor: "transparent !important",
            },
            "& .pro-inner-item": {
              padding: "5px 35px 5px 20px !important",
            },
            "& .pro-inner-item:hover, ": {
              color: colors.redAccent[200] + "!important",
              // fontFamily: "Montserrat-Bold",
            },
            "& .pro-menu-item.active": {
              color: colors.redAccent[200] + "!important",
              fontFamily: "Montserrat-Bold",
              fontWeight: "900 !important",
            },
            //display: { xs: "none", sm: "block"},
            //height: "120vh",
            // position: "fixed",
            zIndex: "1000",
            // width: "270px",
          }}
        >
          <BackButtonListener></BackButtonListener>

          <ProSidebar collapsed={isCollapsed} sx={{ height: "100vh" }}>
            <Menu iconShape="square">
              {/* LOGO AND MENU ICON */}
              <MenuItem
                onClick={() => setIsCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: "10px 0 20px 0",
                  // color: colors.primary[200],
                }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                  >
                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>

              {!isCollapsed && (
                <Box mb="25px">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img src="../../assets/common/Logo.svg" />
                    {/* <img src="../../assets/common/Attention.svg"/> */}
                  </Box>
                </Box>
              )}

              <Box pt={2} paddingLeft={isCollapsed ? undefined : "10%"}>
                <Item
                  title={DASHBOARD}
                  to={FINANCE_DASHBOARD}
                  icon={
                  <SvgIcon>
                          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 27V22.5" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M15.1049 4.23075L4.70991 12.5558C3.53991 13.4858 2.78991 15.4508 3.04491 16.9208L5.03991 28.8608C5.39991 30.9908 7.43991 32.7157 9.59991 32.7157H26.3999C28.5449 32.7157 30.5999 30.9758 30.9599 28.8608L32.9549 16.9208C33.1949 15.4508 32.4449 13.4858 31.2899 12.5558L20.8949 4.24575C19.2899 2.95575 16.6949 2.95575 15.1049 4.23075Z" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>

                  </SvgIcon>}
                  selected={selected}
                  setSelected={setSelected}
                  visible={true}
                  // component={<img src="../../assets/common/Logo.svg" />}
                  sx={{ fontWeight: "700", m: 1 }}
                />

                {/* <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Incentive
                </Typography> */}
                <Item
                  title={VALIDATIONS}
                  to={VALIDATION_ROUTE}
                  icon={<GppMaybeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  visible={Validations}
                />

                <Item
                  title={PAYOUT}
                  to={PAYOUT_ROUTE}
                  icon={
                    <SvgIcon>
                      <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32.9993 18.6953C32.9993 26.9753 26.2793 33.6953 17.9993 33.6953C9.71927 33.6953 2.99927 26.9753 2.99927 18.6953C2.99927 10.4153 9.71927 3.69531 17.9993 3.69531C26.2793 3.69531 32.9993 10.4153 32.9993 18.6953Z" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M23.5663 23.4659L18.9163 20.6909C18.1063 20.2109 17.4463 19.0559 17.4463 18.1109V11.9609" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </SvgIcon>

                  }
                  selected={selected}
                  setSelected={setSelected}
                  visible={Payout}
                />
                <Item
                  title={ON_HOLD}
                  to={ON_HOLD_ROUTE}
                  icon={
                    <SvgIcon>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.975 28.665V7.335C15.975 5.31 15.12 4.5 12.96 4.5H7.515C5.355 4.5 4.5 5.31 4.5 7.335V28.665C4.5 30.69 5.355 31.5 7.515 31.5H12.96C15.12 31.5 15.975 30.69 15.975 28.665Z" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M31.4987 28.665V7.335C31.4987 5.31 30.6437 4.5 28.4837 4.5H23.0387C20.8937 4.5 20.0237 5.31 20.0237 7.335V28.665C20.0237 30.69 20.8787 31.5 23.0387 31.5H28.4837C30.6437 31.5 31.4987 30.69 31.4987 28.665Z" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </SvgIcon>
                  }
                  selected={selected}
                  setSelected={setSelected}
                  visible={OnHold}
                />
                <Item
                  title={EXCLUSION}
                  to={EXCLUSION_ROUTE}
                  icon={
                    <SvgIcon>
                      <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 33.3047C26.28 33.3047 33 26.5847 33 18.3047C33 10.0247 26.28 3.30469 18 3.30469C9.72 3.30469 3 10.0247 3 18.3047C3 26.5847 9.72 33.3047 18 33.3047Z" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M28.35 7.80469L7.34998 28.8047" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </SvgIcon>
                  }
                  selected={selected}
                  setSelected={setSelected}
                  visible={Exclusions}
                />
                {/* <Item
                  title="Formulas"
                  to="/calendar"
                  icon={<CalendarTodayOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
                <Item
                  title={PAYOUT_DATES}
                  to={PAYOUT_DATES_ROUTE}
                  icon={
                    <SvgIcon>
                      <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3.60938V8.10938" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M24 3.60938V8.10938" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.25 14.2441H30.75" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M31.5 13.3594V26.1094C31.5 30.6094 29.25 33.6094 24 33.6094H12C6.75 33.6094 4.5 30.6094 4.5 26.1094V13.3594C4.5 8.85938 6.75 5.85938 12 5.85938H24C29.25 5.85938 31.5 8.85938 31.5 13.3594Z" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M23.5421 21.1592H23.5555" stroke="currentcolor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M23.5421 25.6592H23.5555" stroke="currentcolor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17.9932 21.1592H18.0067" stroke="currentcolor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17.9932 25.6592H18.0067" stroke="currentcolor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.4415 21.1592H12.4549" stroke="currentcolor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.4415 25.6592H12.4549" stroke="currentcolor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </SvgIcon>
                  }
                  selected={selected}
                  setSelected={setSelected}
                  visible={PayoutDates}
                />
                <Item
                  title={WITHOLDING_TAX}
                  to={WITHOLDING_TAX_ROUTE}
                  icon={
                    <SvgIcon>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M33 9V12.63C33 15 31.5 16.5 29.13 16.5H24V6.015C24 4.35 25.365 3 27.03 3C28.665 3.015 30.165 3.675 31.245 4.755C32.325 5.85 33 7.35 33 9Z" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 10.5V31.5C3 32.745 4.41 33.45 5.4 32.7L7.965 30.78C8.565 30.33 9.405 30.39 9.945 30.93L12.435 33.435C13.02 34.02 13.98 34.02 14.565 33.435L17.085 30.915C17.61 30.39 18.45 30.33 19.035 30.78L21.6 32.7C22.59 33.435 24 32.73 24 31.5V6C24 4.35 25.35 3 27 3H10.5H9C4.5 3 3 5.685 3 9V10.5Z" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9.375 15H17.625" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </SvgIcon>
                  }
                  selected={selected}
                  setSelected={setSelected}
                  visible={WithholdingTax}
                />
                {/* <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Reports
                </Typography> */}

                <Item
                  title={REPORTS}
                  to={REPORTS_ROUTE}
                  icon={
                    <SvgIcon>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M33 15V22.5C33 30 30 33 22.5 33H13.5C6 33 3 30 3 22.5V13.5C3 6 6 3 13.5 3H21" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M33 15H27C22.5 15 21 13.5 21 9V3L33 15Z" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.5 19.5H19.5" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.5 25.5H16.5" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </SvgIcon>
                  }
                  selected={selected}
                  setSelected={setSelected}
                  visible={true}
                />

                <Item
                  title={ADJUSTMENT}
                  to={ADJUSTMENT_ROUTE}
                  icon={
                    <SvgIcon>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21.631 8.45898H32.551" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M3.44934 8.46094H14.3693" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M21.631 22.9951H32.551" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M21.631 32.084H32.551" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M27.134 13.905V3" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M3.44934 33.0007L14.3693 22.0957" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M14.3693 33.0007L3.44934 22.0957" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>

                    </SvgIcon>
                  }
                  selected={selected}
                  setSelected={setSelected}
                  visible={true}
                />
                <Item
                  title={EARMARK}
                  to={EARMARK_ROUTE}
                  icon={
                    <SvgIcon>
                      <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 22.4453C20.0711 22.4453 21.75 20.7664 21.75 18.6953C21.75 16.6242 20.0711 14.9453 18 14.9453C15.9289 14.9453 14.25 16.6242 14.25 18.6953C14.25 20.7664 15.9289 22.4453 18 22.4453Z" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M27.75 14.9453V22.4453" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7.5 33.6953C10.8137 33.6953 13.5 31.009 13.5 27.6953C13.5 24.3816 10.8137 21.6953 7.5 21.6953C4.18629 21.6953 1.5 24.3816 1.5 27.6953C1.5 31.009 4.18629 33.6953 7.5 33.6953Z" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7.875 25.8203V27.2153C7.875 27.7403 7.60501 28.2353 7.14001 28.5053L6 29.1953" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 23.4953V14.1953C3 8.94531 6 6.69531 10.5 6.69531H25.5C30 6.69531 33 8.94531 33 14.1953V23.1953C33 28.4453 30 30.6953 25.5 30.6953H12.75" stroke="currentcolor" stroke-width="2.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </SvgIcon>
                  }
                  selected={selected}
                  setSelected={setSelected}
                  visible={Earmark}
                />
                <Item
                  title={FREEZE_ACCOUNT}
                  to={FREEZE_ACCOUNT_ROUTE}
                  icon={
                    <SvgIcon>
                      <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 12.8359V4.58594" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18 31.5859V23.3359" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15 4.58594H21" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15 31.5859H21" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13.4549 15.4609L6.31494 11.3359" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M29.685 24.8359L22.545 20.7109" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M4.81494 13.9302L7.81494 8.74023" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M28.1851 27.4302L31.1851 22.2402" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M23.25 18.0859C23.25 19.0459 22.995 19.9309 22.545 20.7109C21.63 22.2859 19.935 23.3359 18 23.3359C16.065 23.3359 14.37 22.2859 13.455 20.7109C13.005 19.9309 12.75 19.0459 12.75 18.0859C12.75 17.1259 13.005 16.2409 13.455 15.4609C14.37 13.8859 16.065 12.8359 18 12.8359C19.935 12.8359 21.63 13.8859 22.545 15.4609C22.995 16.2409 23.25 17.1259 23.25 18.0859Z" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M29.685 11.3359L22.545 15.4609" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13.4549 20.7109L6.31494 24.8359" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M31.1851 13.9302L28.1851 8.74023" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7.81494 27.4302L4.81494 22.2402" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </SvgIcon>
                  }
                  selected={selected}
                  setSelected={setSelected}
                  visible={FreezeAccount}
                />

                {/* <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Pages
                </Typography> */}
                <Item
                  title={CREDIT_DEBIT}
                  to={CREDIT_DEBIT_ROUTE}
                  icon={
                    <SvgIcon>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.0074 32.9757C26.2744 32.9757 32.9762 26.274 32.9762 18.0069C32.9762 9.73985 26.2744 3.03809 18.0074 3.03809C9.74034 3.03809 3.03857 9.73985 3.03857 18.0069C3.03857 26.274 9.74034 32.9757 18.0074 32.9757Z" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9.20581 6.03223L21.4503 18.3067L21.4802 11.4958" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M26.7942 29.9684L14.5497 17.709L14.5198 24.5048" stroke="currentcolor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </SvgIcon>
                  }
                  selected={selected}
                  setSelected={setSelected}
                  visible={DebitCredit}
                />
                {/* <Item
                  title="Calendar"
                  to="/calendar"
                  icon={<CalendarTodayOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="FAQ Page"
                  to="/faq"
                  icon={<HelpOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Charts
                </Typography>
                <Item
                  title="Bar Chart"
                  to="/bar"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Pie Chart"
                  to="/pie"
                  icon={<PieChartOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Line Chart"
                  to="/line"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Geography Chart"
                  to="/geography"
                  icon={<MapOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
              </Box>
            </Menu>
          </ProSidebar>
        </Box>
      ) : (
        ""
      )}
    </div>
  );
};

export default Sidebar;

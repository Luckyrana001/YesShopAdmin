import "./App.css";
import { Box} from "@mui/material";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import * as yup from "yup";

// import Dashboard from "./scenes/dashboard";
import Validations from "./scenes/validations";
import PayoutsArchive from "./scenes/payoutsArchive";
import Payouts from "./scenes/payouts";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import DataGridDemo from "./scenes/contacts/DataGridDemo";
import FilterReports from "./scenes/faq/details";


import FAQ from "./scenes/faq";
import Form from "./scenes/form";
// import Bar from "./scenes/bar";
// 
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// 
// import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider, colors } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
//import Calendar from "./scenes/calendar/calendar";
import SignInSide from "./scenes/login/SignInSide";
import * as CONSTANT from "./constants/Constant";
import FinanceHomePage from "./scenes/dashboard/finance/FinanceHomePage";

import { OnHoldSummary } from "./scenes/onhold";
import ExclusionScreen from "./scenes/exclusion";
import { WitholdingTaxScreen } from "./scenes/witholdingTax";
import { FreezeAccountScreen } from "./scenes/freezeAccount";
import { CreditDebitScreen } from "./scenes/creditDebit";
import PayoutDatesScreen from "./scenes/payoutDates";
import { EarmarkScreen } from "./scenes/earmark";
import PayoutsTransactionDetails from "./scenes/payoutsArchive/PayoutsTransactionDetails";
import { OnHoldDetails } from "./scenes/onhold/OnHoldDetails";
import { OnHoldAllTransactionsDetails } from "./scenes/onhold/OnHoldAllTransactionsDetails";
import SuccessPage from "./scenes/success/SuccessPage";
import { AddDealerScreen } from "./scenes/earmark/AddDealer";
import PageNotFound from "./scenes/notFound/NotFound";
import { FreezeUnfreezeDealer } from "./scenes/freezeAccount/FreezeUnfreezeDealer";

//import RouteB from './scenes/payoutsArchive/payoutsArchive';
 function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);  
  const [data, setData] = useState(null); // State to hold the data
// Prevent clicks on the progress indicator itself from affecting the loading state
const handleProgressClick = (event) => {
  event.stopPropagation();
};


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
       

        <div className="app"  onClick={handleProgressClick}>
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
           
            <Route path="/" element={<SignInSide />} />
            <Route path={CONSTANT.LOGIN} element={<SignInSide />} />
            <Route path={CONSTANT.FINANCE_DASHBOARD} element={<FinanceHomePage />} />
            {/* <Route path={CONSTANT.DELAER_DASHBOARD_ROUTE} element={<Dashboard />} /> */}

              <Route path={CONSTANT.VALIDATION_ROUTE} element={<Validations />} />
              
              <Route path={CONSTANT.PAYOUT_ARCHIEVE_ROUTE} element={<PayoutsArchive />}  />
              
              <Route path={CONSTANT.PAYOUT_ROUTE} element={<Payouts />} />
              <Route path={CONSTANT.ON_HOLD_ROUTE} element={<OnHoldSummary />} />
              <Route path={CONSTANT.CONTACT_ROUTE} element={<Contacts />} />
              <Route path={CONSTANT.INVOICES_ROUTE} element={<Invoices />} />
              <Route path={CONSTANT.EXCLUSION_ROUTE} element={<ExclusionScreen />} />
              <Route path={CONSTANT.PAYOUT_DATES_ROUTE} element={<PayoutDatesScreen />} />
              <Route path={CONSTANT.WITHOLDING_TAX_ROUTE} element={<WitholdingTaxScreen />} />
              <Route path={CONSTANT.FREEZE_ACCOUNT_ROUTE} element={<FreezeAccountScreen />} />
              <Route path={CONSTANT.CREDIT_DEBIT_ROUTE} element={<CreditDebitScreen />} />
              <Route path={CONSTANT.REPORTS_ROUTE} element={<FAQ />} />
              <Route path={CONSTANT.EARMARK_ROUTE} element={<EarmarkScreen />} />
              <Route path={CONSTANT.REPORTS_FILTER_ROUTE} element={<FilterReports />} />
              <Route path={CONSTANT.PAYOUT_ALL_TRANSACTION_DETAILS} element={<PayoutsTransactionDetails />} />
              <Route path={CONSTANT.ON_HOLD_DETAILS_ROUTE} element={<OnHoldDetails />} />
              <Route path={CONSTANT.ON_HOLD_ALL_TRANSACTIONS_DETAILS} element={<OnHoldAllTransactionsDetails />} />
              <Route path={CONSTANT.SUCCESS_ROUTE} element={<SuccessPage />} />
              <Route path={CONSTANT.ADD_DEALER_ROUTE} element={<AddDealerScreen />} />
              <Route path={CONSTANT.UNFREEZE_FREEZE_DEALER_ROUTE} element={<FreezeUnfreezeDealer />} />

              <Route path={CONSTANT.FORMS_ROUTE} element={<Form />} />
              <Route path="/team" element={<DataGridDemo />} />
            
              
              {/* 
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} /> */}
              <Route path="/faq" element={<FAQ />} />
              {/* <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} /> */}

             <Route path="*" element={<PageNotFound />} />
                
            </Routes>
          </main>
        </div>
       
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}



export default App;
 
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import FinanceDashboard from "./scenes/dashboard/finance";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import { Outlet } from 'react-router-dom';
import { isAuthPageAtom } from "./scenes/global/AppConfig";
import { atom, useAtom } from 'jotai';
import SignInSide from "./scenes/login/SignInSide";
 function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);

  // const {isAuth} = useState(false) // this might be a global store or any other alternative where you're keeping the state
  

  function Layout() {
    const [isAuthPage, setAuthStatus] = useAtom(isAuthPageAtom)
    if (isAuthPage) 
    return  Navigate("/SignInSide");
   else
    return (
      <main>
       <Sidebar isSidebar={isSidebar} />
       <Topbar setIsSidebar={setIsSidebar} />
        <Outlet />
      </main>
    )
  }


  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
            <Route path="/" element={<SignInSide />} />
            <Route path="/login" element={<SignInSide />} />
            <Route path="/financeDashboard" element={<FinanceDashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
        {/* <div className="app">
          <main className="content">
            <Routes>
            <Route path="/login" element={<SignInSide />} />
            <Route path="/" element={<Layout />}>
               <Route path="/dashboard" element={<FinanceDashboard />} />
               <Route path="/team" element={<Team />} />
               <Route path="/contacts" element={<Contacts />} />
               <Route path="/invoices" element={<Invoices />} />
               <Route path="/form" element={<Form />} />
               <Route path="/bar" element={<Bar />} />
               <Route path="/pie" element={<Pie />} />
               <Route path="/line" element={<Line />} />
               <Route path="/faq" element={<FAQ />} />
               <Route path="/calendar" element={<Calendar />} />
               <Route path="/geography" element={<Geography />} />
              </Route>
            </Routes>
          </main>
        </div> */}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}



export default App;
 {/* <Route path="/" element={<Dashboard />} /> */}
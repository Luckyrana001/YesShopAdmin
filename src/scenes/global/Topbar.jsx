import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { isAuthPageAtom } from "./AppConfig";
import { useAtom } from 'jotai'
import { useNavigate } from "react-router-dom";
import { LogoDevOutlined, LogoutOutlined } from "@mui/icons-material";
const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [isAuthPage, setAuthStatus] = useAtom(isAuthPageAtom)
  const navigate = useNavigate();

  function goToDashboard() {
    setAuthStatus(true)
    navigate("/");
  }
  return (
    <div>
       {!isAuthPage ? (
      <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>

        
      
        <IconButton onClick={() => 
           goToDashboard()}>
          <LogoutOutlined  />
        </IconButton>

     
      </Box>
    </Box>
      ) : (
        ''
      )}
      </div>
  );
};

export default Topbar;

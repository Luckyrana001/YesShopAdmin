import { AccessAlarm, AccountCircle } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { atom, useAtom } from 'jotai';
import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { isAuthPageAtom } from "../config/AppConfig";


function LoginComponent() {
  // Consume persisted state like any other atom
  const [isAuthPage, setAuthStatus] = useAtom(isAuthPageAtom)

   const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  function goToDashboard() {
  const toggleAuthMode = () => setAuthStatus(!isAuthPage)
    navigate("/financeDashboard");
  }

  const navigate = useNavigate();

    return (
      <div
        style={{
          width: "380.8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: "50px 40px 30px",
          boxSizing: "border-box",
          position: "relative",
          gap: "50px",
          maxWidth: "100%",
          zIndex: "3",
          textAlign: "left",
          fontSize: "28px",
          color: "#000",
          fontFamily: "Montserrat",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            margin: "0",
            top: "calc(50% - 218.9px)",
            left: "0.1px",
            borderRadius: "16px",
            backgroundColor: "#fff",
            border: "1px solid rgba(148, 176, 224, 0.25)",
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: "0px 27px 0px 26px",
          }}
        >
          <h4
            style={{
              margin: "0",
              position: "relative",
              fontSize: "inherit",
              fontWeight: "600",
              fontFamily: "inherit",
              zIndex: "1",
            }}
          >
            Log into Account
          </h4>
        </div>
        <div
          style={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: "20px",
            zIndex: "1",
            fontSize: "15px",
          }}
        >
          <div
            style={{
              alignSelf: "stretch",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexShrink: "0",
              debugCommit: "2554057",
            }}
          >
            <div
              style={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: "30px",
              }}
            >
              <div
                style={{
                  alignSelf: "stretch",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  padding: "0px 0px 20px",
                  position: "relative",
                  gap: "0px",
                }}
              >

                
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    margin: "0",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px",
                    borderRadius: "2px",
                    backgroundColor: "#fff",
                    border: "0.9px solid rgba(148, 176, 224, 0.5)",
                    boxSizing: "border-box",
                  }}
                />
                <div
                  style={{
                    height: "70px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    padding: "0px 0px 0px 40px",
                  }}
                >
                  <TextField
          id="standard-search"
          sx={{ m: 1, width: '25ch' }}
          label="Username"
          type="search"
          variant="standard"
          InputProps={{ disableUnderline: true }}
        />
                  {/* <b
                    style={{
                      position: "relative",
                      display: "inline-block",
                      minWidth: "53px",
                      zIndex: "1",
                    }}
                  >
                    BizOps
                  </b> */}
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    height: "1px",
                    position: "relative",
                    borderTop: "0.9px solid #94b0e0",
                    boxSizing: "border-box",
                    opacity: "0.5",
                    mixBlendMode: "normal",
                    zIndex: "1",
                  }}
                />
                <div
                  style={{
                    height: "50px",
                    alignSelf: "stretch",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    padding: "0px 0px 0px 40px",
                  }}
                >
                  {/* <div
                    style={{
                     
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "20px",
                    }}
                  > */}

{/* <TextField
        id="input-with-icon-textfield"
        label="Password"
        variant="standard"
        width="stretch"
      /> */}
       <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            disableUnderline={true} 
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
                    {/* <b
                      style={{
                        position: "relative",
                        letterSpacing: "4.5px",
                        display: "inline-block",
                        minWidth: "122px",
                        flexShrink: "0",
                        debugCommit: "2554057",
                        zIndex: "1",
                      }}
                    >
                      ***********
                    </b> */}
                    {/* <div
                      style={{
                        height: "16.2px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        padding: "2.700000000000273px 0px 0px",
                        boxSizing: "border-box",
                      }}
                    >
                      <img
                        style={{
                          width: "19.8px",
                          height: "13.5px",
                          position: "relative",
                          flexShrink: "0",
                          debugCommit: "2554057",
                          zIndex: "1",
                        }}
                        loading="lazy"
                        alt=""
                        src="/shape-copy-11.svg"
                      />
                    </div> */}
                  {/* </div> */}
                </div>
                <img
                  style={{
                    width: "15px",
                    height: "20px",
                    position: "absolute",
                    margin: "0",
                    top: "25px",
                    left: "20px",
                    zIndex: "2",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                  alt=""
                  src="/username_icon_login.svg"
                />
                <img
                  style={{
                    width: "15px",
                    height: "20px",
                    position: "absolute",
                    margin: "0",
                    bottom: "25px",
                    left: "20px",
                    objectFit: "cover",
                    zIndex: "2",
                  }}
                  loading="lazy"
                  alt=""
                  src="/lock_icon_login.png"
                />
               
              </div>
              <button
                style={{
                  cursor: "pointer",
                  border: "none",
                  padding: "12.599999999999907px 20px 12.900000000000093px 29px",
                  backgroundColor: "transparent",
                  alignSelf: "stretch",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  position: "relative",
                }}
                onClick={() => goToDashboard()}
              >
                <img
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    margin: "0",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px",
                    borderRadius: "28.8px",
                    maxWidth: "100%",
                    overflow: "hidden",
                    maxHeight: "100%",
                  }}
                  alt=""
                  src="/rectangle-6-copy.svg"
                />
                <b
                  style={{
                    position: "relative",
                    fontSize: "12.6px",
                    letterSpacing: "0.22px",
                    textTransform: "uppercase",
                    display: "inline-block",
                    fontFamily: "Montserrat",
                    color: "#fff",
                    textAlign: "left",
                    minWidth: "44px",
                    zIndex: "1",
                  }}
                >
                  Login
                </b>
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              padding: "0px 42px 0px 41.90000000000009px",
              fontSize: "14px",
              color: "#ff0084",
            }}
          >
            <div
              style={{
                position: "relative",
                fontWeight: "500",
                flexShrink: "0",
                debugCommit: "2554057",
              }}
            >
              Forgot Username or Password
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default LoginComponent;
  
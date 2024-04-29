import { tokens } from "../../theme";
import * as React from "react";
import { Grid, Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Divider from "@mui/material/Divider";
import CustomButton from "../../components/CustomButton";
import { Link } from 'react-router-dom';

const Success = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);    

    return (
        <Grid
            component="main"
            direction={"column"}
            sx={{
                margin: "0 2.5%",
                borderRadius: "18px",
            }}
            >
        
                <Grid
                    container
                    mt={3}
                    borderRadius={2}
                    xs={12}
                    p={3}
                    direction={"row"}
                    sx={{
                        background: colors.grey[900],
                        borderRadius: "12px",
                        border: "1px solid" + colors.grey[600],
                        }}
                    >
                        <Grid container justifyContent={"center"} spacing={2.5}>
                            <Grid item>
                                <img src="../../assets/common/Approved-tick.svg" width={108} />
                            </Grid>

                            <Grid item alignItems={"center"} sx={{display: "flex" }} >
                                <Grid container direction={"column"} spacing={0.5} sx={{textAlign: { xs:"center", sm:"left" } }}>
                                    <Grid item><Typography variant="h3" fontWeight={"600"}>Approved</Typography></Grid>
                                    <Grid item><Typography variant="h6" fontWeight={"400"}>Please wait while we process your request</Typography></Grid>
                                </Grid>
                            </Grid>
                            
                        </Grid>
                </Grid>

                <Grid
                    container
                    mt={3}
                    borderRadius={2}
                    xs={12}
                    direction={"column"}
                    justifyItems={"center"}
                    alignItems={"center"}
                    sx={{
                        background: colors.grey[900],
                        borderRadius: "12px 12px 0 0",
                        border: "1px solid" + colors.grey[600],
                        padding: "2% 0"
                        }}
                    >
                        
                    <Grid container direction={"row"} alignItems={"center"} md={6} sm={10} xs={10}>
                        <Grid
                            item
                            xs={6}
                            sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            }}
                        >
                            Total PayOut
                        </Grid>

                        <Grid
                            item
                            xs={6}
                            sx={{
                            padding: "0",
                            fontSize: "26px",
                            fontWeight: "500",
                            textAlign: "right",
                            alignItems:"center",
                            }}
                        >
                            <Typography sx={{display:"inline-flex", marginRight:"3%"}}>RM</Typography>100,000
                        </Grid>

                            
                    </Grid>   


                </Grid>

                <Divider
                    orientation="horizontal"
                    flexItem
                    sx={{
                    border: "1px solid" + colors.primary[100],
                    }}
                />

                <Grid
                    container
                    borderRadius={2}
                    direction={"column"}
                    justifyItems={"center"}
                    alignItems={"center"}
                    sx={{
                        background: colors.grey[900],
                        borderRadius: "0 0 12px 12px",
                        border: "1px solid" + colors.grey[600],
                        padding: "2% 0"
                        }}
                    >
                        
                    <Grid container direction={"row"} alignItems={"center"} md={6} sm={10} xs={10}>
                        <Grid item xs={6} sx={{ fontSize: "13px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1px"}}>
                            Dealers
                        </Grid>
                        <Grid item xs={6} sx={{ fontSize: "16px", fontWeight: "500", textAlign: "right", alignItems:"center"}}>
                            24
                        </Grid>
                        <Divider orientation="horizontal" flexItem sx={{ border: "0.5px solid" + colors.primary[700], margin: "1% auto", width:"100%" }} />
                    </Grid>

                    <Grid container direction={"row"} alignItems={"center"} md={6} sm={10} xs={10}>
                        <Grid item xs={6} sx={{ fontSize: "13px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1px"}}>
                            No. of Transactions
                        </Grid>
                        <Grid item xs={6} sx={{ fontSize: "16px", fontWeight: "500", textAlign: "right", alignItems:"center"}}>
                            9,800
                        </Grid>
                        <Divider orientation="horizontal" flexItem sx={{ border: "0.5px solid" + colors.primary[700], margin: "1% auto", width:"100%" }} />
                    </Grid>

                    <Grid container direction={"row"} alignItems={"center"} md={6} sm={10} xs={10}>
                        <Grid item xs={6} sx={{ fontSize: "13px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1px"}}>
                            Date
                        </Grid>
                        <Grid item xs={6} sx={{ fontSize: "16px", fontWeight: "500", textAlign: "right", alignItems:"center"}}>
                            18 Jan 2024
                        </Grid>
                        <Divider orientation="horizontal" flexItem sx={{ border: "0.5px solid" + colors.primary[700], margin: "1% auto", width:"100%" }} />
                    </Grid>

                    <Grid container direction={"row"} alignItems={"center"} md={6} sm={10} xs={10}>
                        <Grid item xs={6} sx={{ fontSize: "13px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1px"}}>
                            Reference No.
                        </Grid>
                        <Grid item xs={6} sx={{ fontSize: "16px", fontWeight: "500", textAlign: "right", alignItems:"center"}}>
                            YA213213123421414
                        </Grid>
                    </Grid>


                </Grid>
            
            <Grid container justifyContent={"center"} p={3} >
                
            <Link to="/payouts">
                <CustomButton
                btnBG={colors.primary[100]}
                btnColor={colors.grey[900]}
                btnTxt={"Done"}
                ></CustomButton>
            </Link>

            </Grid>
            
                                      
            

      </Grid>
        );

};

export default Success;
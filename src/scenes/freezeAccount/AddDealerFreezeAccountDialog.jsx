import React, { useState } from "react";
import {
  Dialog,
  useTheme,
  Stack,
  DialogContent,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import CustomButton from "../../components/CustomButton";
import { tokens } from "../../theme";
import { useEffect } from "react";
import { selectedItems } from "../../config/AppConfig";
import { useAtom } from "jotai";
import DebugLog from "../../utils/DebugLog";

function AddDealerFreezeAccountDialog({
  open,
  onClose,
  onDialogButtonClick,
  onDialogRemoveButtonClick,
  data,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedItem, setSelectedItem] = useAtom(selectedItems);

  useEffect(() => {
    if (data) {
     
      const value = {
        company: data.accountName?data.accountName:"",
        code: data.accountCode?data.accountCode:"",
        vendorCode: data.vendorCode?data.vendorCode:"",
        frozenReason: data.freezeReason?data.freezeReason:"",
        pic:data.pic?data.pic:"",
        accountNo:data.bankAccountNumber?data.bankAccountNumber:"",
        bank:data.bankName?data.bankName:"",
      };
      setFormData(value);
    }

   
    setDialogOpen(open);
  }, [open, data]);

  const [formData, setFormData] = useState({
     company: "",
    code: "",
    vendorCode: "",
    frozenReason: "",
    pic:"",
    accountNo:"",
    bank:"",

  });
  const [errors, setErrors] = useState({});

  const [dialogOpen, setDialogOpen] = useState(open);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  
  const handleRemove = (e) => {
    e.preventDefault();
    // Validation logic
    // const newErrors = {};

    // if (!formData.company.trim()) {
    //   newErrors.company = "Company Name is required";
    // }

    // if (!formData.code) {
    //   newErrors.code = "Code is required";
    // }

    // if (!formData.vendorCode) {
    //   newErrors.vendorCode = "Vndor Code is required";
    // }

    // if (!formData.frozenReason) {
    //   newErrors.frozenReason = "Reason is required";
    // }

    // if (!formData.pic) {
    //   newErrors.pic = "Pic is required";
    // }

    // if (!formData.accountNo) {
    //   newErrors.accountNo = "Account number is required";
    // }

    // if (!formData.bank) {
    //   newErrors.bank = "Bank name is required";
    // }
    // if (Object.keys(newErrors).length === 0) {
    //   // Form is valid, submit the data
    //   console.log("Form data:", formData);

    //   // Close the dialog
    //   onClose();

    //  // onDialogButtonClick(selectedItem, formData);
    //   onDialogRemoveButtonClick(selectedItem, formData);
    //   // You can perform additional actions like sending data to a server here
    // } else {
    //   // Form is not valid, update the errors state
    //   setErrors(newErrors);
    // }
    onDialogRemoveButtonClick(selectedItem, formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
    const newErrors = {};

    if (!formData.company.trim()) {
      newErrors.company = "Company Name is required";
    }

    if (!formData.code) {
      newErrors.code = "Code is required";
    }

    if (!formData.vendorCode) {
      newErrors.vendorCode = "Vndor Code is required";
    }

    if (!formData.frozenReason) {
      newErrors.frozenReason = "Reason is required";
    }

    if (!formData.pic) {
      newErrors.pic = "Pic is required";
    }

    if (!formData.accountNo) {
      newErrors.accountNo = "Account number is required";
    }

    if (!formData.bank) {
      newErrors.bank = "Bank name is required";
    }
    if (Object.keys(newErrors).length === 0) {
      // Form is valid, submit the data
      console.log("Form data:", formData);

      // Close the dialog
      onClose();

      onDialogButtonClick(selectedItem, formData);

      // You can perform additional actions like sending data to a server here
    } else {
      // Form is not valid, update the errors state
      setErrors(newErrors);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}   maxWidth="lg" >
      <DialogContent>
        <Grid container direction={"column"}>
          <Grid container  >
            <Grid container justifyContent="center" alignItems="center" item>
              <Typography fontWeight={"600"} variant="h3" p={1}>
                Frozen Account
              </Typography>
            </Grid>
            <Grid container justifyContent="center" alignItems="center" item>
              <Typography fontSize={"16px"} fontWeight={"400"} pb={4}>
                Details
              </Typography>
            </Grid>
          </Grid>

          <form>
            <Grid container direction={"column"}>
              
              <Grid container xs={12} alignItems={"center"} spacing={3}  pb={.5}>
                <Grid item xs={4}>
                  <Typography
                    color={colors.grey[100]}
                    fontWeight={"500"}
                     variant="h7"
                    sx={{ textAlign: "right" }}
                  >
                    Company
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                   inputProps={{ style: { height: "20px" } }}
                    margin="dense"
                    label="Company"
                    type="text"
                    name="company"
                    fullWidth
                    value={formData.company}
                    onChange={handleInputChange}
                    error={Boolean(errors.company)}
                    helperText={errors.company}
                  />
                </Grid>
              </Grid>

              <Grid container xs={12} alignItems={"center"} spacing={3}  pb={.5}>
                <Grid item xs={4}>
                  <Typography
                    color={colors.grey[100]}
                    fontWeight={"500"}
                     variant="h7"
                    sx={{ textAlign: "right" }}
                  >
                    Code
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                   inputProps={{ style: { height: "20px" } }}
                    margin="dense"
                    label="Code"
                    type="text"
                    name="code"
                    fullWidth
                    value={formData.code}
                    onChange={handleInputChange}
                    error={Boolean(errors.code)}
                    helperText={errors.code}
                  />
                </Grid>
              </Grid>

              <Grid container xs={12} alignItems={"center"} spacing={3}  pb={.5}>
                <Grid item xs={4}>
                  <Typography
                   
                    color={colors.grey[100]}
                    fontWeight={"500"}
                     variant="h7"
                    sx={{ textAlign: "right" }}
                  >
                   Vendor Code
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                   inputProps={{ style: { height: "20px" } }}
                    margin="dense"
                    label="Vendor Code"
                    type="text"
                    name="vendorCode"
                    fullWidth
                    value={formData.vendorCode}
                    onChange={handleInputChange}
                    error={Boolean(errors.vendorCode)}
                    helperText={errors.vendorCode}
                  />
                </Grid>
              </Grid>


              <Grid container xs={12} alignItems={"center"} spacing={3}  pb={.5}>
                <Grid item xs={4}>
                  <Typography
                    color={colors.grey[100]}
                    fontWeight={"500"}
                     variant="h7"
                    sx={{ textAlign: "right" }}
                  >
                   Frozen Reason
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                   inputProps={{ style: { height: "20px" } }}
                    margin="dense"
                    label="Frozen Reason"
                    type="text"
                    name="frozenReason"
                    fullWidth
                    value={formData.frozenReason}
                    onChange={handleInputChange}
                    error={Boolean(errors.frozenReason)}
                    helperText={errors.frozenReason}
                  />
                </Grid>
              </Grid>


              <Grid container xs={12} alignItems={"center"} spacing={3}  pb={.5}>
                <Grid item xs={4}>
                  <Typography
                    color={colors.grey[100]}
                    fontWeight={"500"}
                     variant="h7"
                    sx={{ textAlign: "right" }}
                  >
                   PIC
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                   inputProps={{ style: { height: "20px" } }}
                    margin="dense"
                    label="PIC"
                    type="text"
                    name="pic"
                    fullWidth
                    value={formData.pic}
                    onChange={handleInputChange}
                    error={Boolean(errors.pic)}
                    helperText={errors.pic}
                  />
                </Grid>
              </Grid>


              <Grid container xs={12} alignItems={"center"} spacing={3}  pb={.5}>
                <Grid item xs={4}>
                  <Typography
                    color={colors.grey[100]}
                    fontWeight={"500"}
                     variant="h7"
                    sx={{ textAlign: "right" }}
                  >
                   Account no.
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                   inputProps={{ style: { height: "20px" } }}
                    margin="dense"
                    label="Account No."
                    type="text"
                    name="accountNo"
                    fullWidth
                    value={formData.accountNo}
                    onChange={handleInputChange}
                    error={Boolean(errors.accountNo)}
                    helperText={errors.accountNo}
                  />
                </Grid>
              </Grid>


              <Grid container xs={12} alignItems={"center"} spacing={3} pb={.5}>
                <Grid item xs={4}>
                  <Typography
                    color={colors.grey[100]}
                    fontWeight={"500"}
                     variant="h7"
                    sx={{ textAlign: "right" }}
                  >
                   Bank
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                   inputProps={{ style: { height: "20px" } }}
                    margin="dense"
                    label="Bank"
                    type="text"
                    name="bank"
                    fullWidth
                    value={formData.bank}
                    onChange={handleInputChange}
                    error={Boolean(errors.bank)}
                    helperText={errors.bank}
                  />
                </Grid>
              </Grid>

              <Stack
                direction="row"
                pt={2}
                spacing={2}
                justifyContent={"center"}
              >
                <CustomButton
                  btnBG={colors.primary[900]}
                  btnColor={colors.grey[100]}
                  btnTxt={"CANCEL"}
                  btnBorder={"1px solid" + colors.primary[800]}
                  onClick={handleRemove}
                ></CustomButton>

                <CustomButton
                  btnBG={colors.primary[100]}
                  btnColor={colors.grey[900]}
                  btnTxt={"FREEZE"}
                  btnBorder={"1px solid" + colors.primary[100]}
                  onClick={handleSubmit}
                ></CustomButton>
              </Stack>

            
            </Grid>

            
            {/* Add more fields as needed */}
          </form>
        </Grid>
      </DialogContent>
      
    </Dialog>
  );
}

export default AddDealerFreezeAccountDialog;

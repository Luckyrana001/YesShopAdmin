import { Box, useTheme, Link, IconButton, TextField,styled } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import GreetingHeader from "../../components/GreetingHeader";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import ReportLink from "../../components/ReportLinks";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { DateRange } from '@mui/icons-material';

import { Radio, RadioGroup } from "@mui/material";
import {
  Dialog,
  Stack,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  colors,
} from "@mui/material";
import { InputLabel, Select, MenuItem } from "@mui/material";
import { AccountCircle, Search } from '@mui/icons-material';
import {InputAdornment } from '@mui/material';

import CustomButton from "../../components/CustomButton";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import { useEffect, useState } from "react";
import { selectedItems } from "../../config/AppConfig";
import { useAtom } from "jotai";
import DebugLog from "../../utils/DebugLog";
import { FormControl, FormControlLabel, Checkbox } from "@mui/material";
import DatePickerDialog from "../../components/DatePickerDialog";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomDatePickerDialog from "../../components/DatePickerDialog";
const AddAdjustments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedItem, setSelectedItem] = useAtom(selectedItems);
  const [checked, setChecked] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("option1");
  const dropdownHeight = '400px'; // Set the desired height
 
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    DebugLog("Dialog Closed")
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    DebugLog("Selected Date "+selectedDate)
  };

  const dropdownStyle = {
    maxHeight: dropdownHeight,
    overflowY: 'auto', // Add a scrollbar if needed
  };
  // const useStyles = makeStyles((theme) => ({
  //   formControl: {
  //     height: '100px', // Set the desired height for the FormControl
  //   },
  // }));

  // const classes = useStyles();
  const [formData, setFormData] = useState({
    dealer: "",
    type: "",
    description: "",
    amount: "",
    date: selectedDate,
    refrenceNo: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});

  //const [dialogOpen, setDialogOpen] = useState(open);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  
const StyledInputLabel = styled(InputLabel)({
  height: '40px', // Set the desired height for the InputLabel
});

  
  const handleRemove = (e) => {
    e.preventDefault();
    // Close the dialog
    // onClose();

    //  onDialogRemoveButtonClick(selectedItem);
  };
  const handleTypeDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleRadioButtonChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  function dealerSearchIconClick() {
  //  alert("icon clicked");
    setOpen(true);

   // DatePickerDialog()
  }

  function openDatePickerDialog() {
    alert("icon clicked");

    DatePickerDialog()
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
    const newErrors = {};

    if (!formData.dealer.trim()) {
      newErrors.dealer = "Dealer Name is required";
    }

    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    }

    if (!formData.date) {
      newErrors.date = "Please choose Date";
    }

    if (!formData.refrenceNo) {
      newErrors.refrenceNo = "Refrence number is required";
    }

    if (!formData.reason) {
      newErrors.reason = "Reason is required";
    }
    if (Object.keys(newErrors).length === 0) {
      // Form is valid, submit the data
      console.log("Form data:", formData);

      // Close the dialog
      //onClose();

      // onDialogButtonClick(selectedItem, formData);

      // You can perform additional actions like sending data to a server here
    } else {
      // Form is not valid, update the errors state
      setErrors(newErrors);
    }
  };
  return (
    <Box>
      {/* <Header title="FAQ" subtitle="Frequently Asked Questions Page" /> */}
      {/* <DatePickerDialog />  */}
      <Grid
        container
        component="main"
        direction={"column"}
        sx={{
          // height: "100vh",
          m: "0 2.5%" /* Approx 30px */,
          borderRadius: "18px",
        }}
      >
           <CustomDatePickerDialog
        open={open}
        onClose={handleClose}
        onSelect={handleDateSelect}
      />
        {/* Header */}
        <Grid container direction={"row"} alignItems={"center"}>
          <Grid item mr={2}>
            <IconButton href="/creditDebit" width={12}>
              <img src={"../../assets/common/Back.svg"} width={12} />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography
              color={colors.grey[100]}
              fontWeight={"600"}
              variant="h3"
            >
              Add Adjustment
            </Typography>
          </Grid>
        </Grid>
        {/* Header */}

        {/* Form Filter */}

        <Grid
          container
          mt={2}
          p={3}
          direction={"column"}
          alignItems={"center"}
          sx={{
            background: colors.grey[900],
            borderRadius: "12px",
          }}
        >
          <Grid item>
            <Typography
              color={colors.grey[100]}
              fontWeight={"700"}
              variant="h6"
            >
              Please provide details
            </Typography>
          </Grid>
          <Grid container mt={1.5} xs={6} spacing={3}>
            <form>
              <Grid container direction={"column"}>
                <Grid container xs={26} alignItems={"center"} spacing={3}>
                  <Grid item xs={2}>
                    <Typography
                      color={colors.grey[100]}
                      fontWeight={"500"}
                      variant="h7"
                      sx={{ textAlign: "right" }}
                    >
                      Dealer
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      margin="dense"
                      label="Search by Name / Code / Vendor"
                      type="text"
                      name="dealer"
                     
                      fullWidth
                      inputProps={{ style: { height: "20px" } }}
                      value={formData.dealer}
                      onChange={handleInputChange}
                      error={Boolean(errors.dealer)}
                      helperText={errors.dealer}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton>
                              <Search  onClick={dealerSearchIconClick}/>
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />


                  </Grid>
                </Grid>

               

                <Grid container xs={26} alignItems={"center"} spacing={3} mt={.5}>
                  <Grid item xs={2}>
                    <Typography
                      color={colors.grey[100]}
                      fontWeight={"500"}
                      variant="h7"
                      sx={{ textAlign: "right" }}
                    >
                      Type
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth >
                      <StyledInputLabel id="demo-simple-select-outlined-label"
                       >
                        Select Option
                      </StyledInputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        name="type"
                       //value={selectedValue}
                       // onChange={handleTypeDropdownChange}
                        label="Select Option"
                        inputProps={{ style: { height: "20px" } }}
                        fullWidth
                        value={formData.type}
                        onChange={handleInputChange}
                        error={Boolean(errors.type)}
                        helperText={errors.type}
                        MenuProps={{ PaperProps: { style: dropdownStyle } }} // Apply styles to the dropdown menu
     
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="option1">Credit / Debit</MenuItem>
                        <MenuItem value="option2">Credit</MenuItem>
                        <MenuItem value="option3">Debit</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* <Grid container xs={26} alignItems={"center"} spacing={3}>
                  <Grid item xs={2}>
                    <Typography
                      color={colors.grey[100]}
                      fontWeight={"500"}
                      variant="h7"
                      sx={{ textAlign: "right" }}
                    >
                      Type
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      margin="dense"
                      label="Type"
                      type="text"
                      name="type"
                      inputProps={{ style: { height: "10px" } }}
                      fullWidth
                      value={formData.type}
                      onChange={handleInputChange}
                      error={Boolean(errors.type)}
                      helperText={errors.type}
                    />
                  </Grid>
                </Grid> */}

                <Grid container xs={26} alignItems={"center"} spacing={3} mt={.5}>
                  <Grid item xs={2}>
                    <Typography
                      color={colors.grey[100]}
                      fontWeight={"500"}
                      variant="h7"
                      sx={{ textAlign: "right" }}
                    >
                      Description
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>

                  <FormControl variant="outlined" fullWidth >
                      <StyledInputLabel id="demo-simple-select-outlined-label"
                       >
                        Select Description
                      </StyledInputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        name="description"
                       //value={selectedValue}
                       // onChange={handleTypeDropdownChange}
                        label="Select Description"
                        inputProps={{ style: { height: "20px" } }}
                        fullWidth
                        value={formData.description}
                        onChange={handleInputChange}
                        error={Boolean(errors.description)}
                        helperText={errors.description}
                        MenuProps={{ PaperProps: { style: dropdownStyle } }} // Apply styles to the dropdown menu
     
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="option1">Storage</MenuItem>
                        <MenuItem value="option2">Hold</MenuItem>
                        <MenuItem value="option3">Payout</MenuItem>
                      </Select>
                    </FormControl>




                    {/* <TextField
                      inputProps={{ style: { height: "10px" } }}
                      margin="dense"
                      label="Description"
                      type="text"
                      name="description"
                      fullWidth
                      value={formData.description}
                      onChange={handleInputChange}
                      error={Boolean(errors.description)}
                      helperText={errors.description}
                    /> */}
                  </Grid>
                </Grid>

                <Grid container xs={26} alignItems={"center"} spacing={3}>
                  <Grid item xs={2}>
                    <Typography
                      color={colors.grey[100]}
                      fontWeight={"500"}
                      variant="h7"
                      sx={{ textAlign: "right" }}
                    >
                      Amount
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      inputProps={{ style: { height: "20px" } }}
                      margin="dense"
                      label="Amount"
                      type="text"
                      name="amount"
                      fullWidth
                      value={formData.amount}
                      onChange={handleInputChange}
                      error={Boolean(errors.amount)}
                      helperText={errors.amount}
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  xs={26}
                  alignItems={"center"}
                  spacing={3}
                  pb={1}
                
                >
                  <Grid item xs={2}>
                    <Typography
                      color={colors.grey[100]}
                      fontWeight={"500"}
                      variant="h7"
                      sx={{ textAlign: "right" }}
                    >
                      Posting
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        aria-label="schedule"
                        name="schedule"
                        value={selectedValue}
                        onChange={handleRadioButtonChange}
                        row // Aligns radio buttons horizontally
                      >
                        <FormControlLabel
                          value="scheduledOption"
                          control={<Radio />}
                          label="Scheduled"
                        />
                        <FormControlLabel
                          value="immediateOption"
                          control={<Radio />}
                          label="Immediate"
                        />
                        {/* <FormControlLabel value="option3" control={<Radio />} label="Option 3" /> */}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container xs={26} alignItems={"center"} spacing={3}>
                  <Grid item xs={2}>
                    <Typography
                      color={colors.grey[100]}
                      fontWeight={"500"}
                      variant="h7"
                      sx={{ textAlign: "right" }}
                    >
                      Date
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>

                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']} 
                   name="date"
                   value={formData.date}
                   onChange={handleInputChange}
                   error={Boolean(errors.date)}
                   helperText={errors.date}>
                  <DatePicker label="Choose Date" />
                  </DemoContainer>
                  </LocalizationProvider> */}


                    <TextField
                      inputProps={{ style: { height: "20px" } }}
                      margin="dense"
                      label="Date"
                      type="text"
                      name="date"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton>
                              <DateRange  onClick={dealerSearchIconClick}/>
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      value={selectedDate}
                      onChange={handleInputChange}
                      error={Boolean(errors.date)}
                      helperText={errors.date}
                    />
                  </Grid>
                </Grid>

                <Grid container xs={26} alignItems={"center"} spacing={3}>
                  <Grid item xs={2}>
                    <Typography
                      color={colors.grey[100]}
                      fontWeight={"500"}
                      variant="h7"
                      sx={{ textAlign: "right" }}
                    >
                      Refrence No.
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      inputProps={{ style: { height: "20px" } }}
                      margin="dense"
                      label="e.g. (YA_XXXXXX)"
                      type="text"
                      name="refrenceNo"
                      fullWidth
                      value={formData.refrenceNo}
                      onChange={handleInputChange}
                      error={Boolean(errors.refrenceNo)}
                      helperText={errors.refrenceNo}
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  xs={26}
                  alignItems={"center"}
                  spacing={3}
                  pb={1}
                >
                  <Grid item xs={2}>
                    <Typography
                      color={colors.grey[100]}
                      fontWeight={"500"}
                      variant="h7"
                      sx={{ textAlign: "right" }}
                    >
                      Reason
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      inputProps={{ style: { height: "20px" } }}
                      margin="dense"
                      label="Reason for Adjustment"
                      type="text"
                      name="reason"
                      fullWidth
                      value={formData.reason}
                      onChange={handleInputChange}
                      error={Boolean(errors.reason)}
                      helperText={errors.reason}
                    />
                  </Grid>
                </Grid>

                {/* <FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="I agree to the terms and conditions"
                  />
                </FormControl> */}

                <Stack
                  direction="row"
                  pt={2}
                  spacing={2}
                  justifyContent={"center"}
                >
                  {/* <CustomButton
                    btnBG={colors.primary[900]}
                    btnColor={colors.grey[100]}
                    btnTxt={"UNFREEZE"}
                    btnBorder={"1px solid" + colors.primary[800]}
                    onClick={handleRemove}
                  ></CustomButton> */}

                  <CustomButton
                    btnBG={colors.primary[100]}
                    btnColor={colors.grey[900]}
                    btnTxt={"SAVE"}
                    btnBorder={"1px solid" + colors.primary[100]}
                    onClick={handleSubmit}
                  ></CustomButton>
                </Stack>
              </Grid>

              {/* Add more fields as needed */}
            </form>
          </Grid>
        </Grid>

        {/* Form Filter */}
      </Grid>
    </Box>
  );
};

export default AddAdjustments;

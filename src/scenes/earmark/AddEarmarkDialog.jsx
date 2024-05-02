
import React, { useState } from 'react';
import { Dialog, useTheme, Stack, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Grid, Typography, colors } from '@mui/material';
import CustomButton from '../../components/CustomButton';
import { tokens } from "../../theme";
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';

function AddEarmarkDialogInput({ open, onClose }) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    dealer: '',
    earmark: '',
    reason: '',
    // Add more fields as needed
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const {  name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    //const { name, value } = e.target;
   //setFormData({ ...formData, [name]: value });
    // Clear the error message when the user types
    setErrors({ ...errors, [name]: '' });
  };

//   const handleSubmit = () => {
//     // Handle form submission
//     console.log(formData);
//     // Close the dialog
//     onClose();
//   };

const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
    const newErrors = {};
    if (!formData.dealer.trim()) {
      newErrors.dealer = 'Dealer Name is required';
    }
    if (!formData.earmark.trim()) {
      newErrors.earmark = 'Earmark is required';
     } //else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   newErrors.email = 'Invalid email address';
    // }

    if (!formData.reason.trim()) {
        newErrors.reason = 'Reason is required';
       }
    if (Object.keys(newErrors).length === 0) {
      // Form is valid, submit the data
      console.log('Form data:', formData);

       // Close the dialog
      onClose();
      // You can perform additional actions like sending data to a server here
    } else {
      // Form is not valid, update the errors state
      setErrors(newErrors);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
     
      <DialogContent>

      <Grid container direction={"column"}  >

        <Grid container>
          <Grid container justifyContent="center" alignItems="center" item ><Typography fontWeight={"600"} variant="h3" p={1}>Add Earmark</Typography></Grid>  
          <Grid container justifyContent="center" alignItems="center" item ><Typography fontSize={"16px"} fontWeight={"400"} pb={4}>YTL Digital Sdn Bhd (Yes Stores)</Typography></Grid>
        </Grid>

        <form onSubmit={handleSubmit}>

          
          <Grid container direction={"column"}>
            <Grid container xs={12} alignItems={"center"} spacing={3} pb={2}>
                <Grid item xs={4}>
                  <Typography
                    color={colors.grey[100]}
                    fontWeight={"500"}
                    variant="h6"
                    sx={{ textAlign:"right" }}
                  >
                    Earmark
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Earmark"
                    variant="outlined"
                  />
                </Grid>
            </Grid>

            <Grid container xs={12} alignItems={"center"} spacing={3} pb={2}>
              <Grid item xs={4}>
                <Typography
                  color={colors.grey[100]}
                  fontWeight={"500"}
                  variant="h6"
                  sx={{ textAlign:"right" }}
                >
                  Reason
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Reason"
                  variant="outlined"
                />
              </Grid>
          </Grid>

          <Stack direction="row" pt={2} spacing={2} justifyContent={"center"}>

              <CustomButton
                btnBG={colors.primary[900]}
                btnColor={colors.grey[100]}
                btnTxt={"Remove Earmark"}
                btnBorder={"1px solid"+colors.primary[800]}
              ></CustomButton>

              <CustomButton
                btnBG={colors.primary[100]}
                btnColor={colors.grey[900]}
                btnTxt={"Save Earmark "}  
                btnBorder={"1px solid"+colors.primary[100]}
              ></CustomButton>

            </Stack>

            <Grid container xs={8}>
              
              <Grid item pt={4} fontSize={20} fontWeight={700} xs={6}>Activity</Grid>

              <Grid item xs={12} justifyItem={"flex-start"} alignItem={"flex-start"}>

                <Timeline
                  sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                      flex: 0,
                      padding: 0,
                    },
                  }}
                >

                  <TimelineItem>
                    <TimelineSeparator><TimelineDot sx={{background:colors.primary[100], width:"14px", height:"14px", marginTop:"70%"  }} /><TimelineConnector sx={{ background:colors.primary[700], width:"1px", }} /></TimelineSeparator>
                    <TimelineContent fontWeight={"600"} >+ RM 5000</TimelineContent>
                    <TimelineContent color={colors.grey[300]}>1 Feb 2024</TimelineContent>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineSeparator><TimelineDot sx={{background:colors.primary[700]}} /><TimelineConnector sx={{ background:colors.primary[700], width:"1px", }} /></TimelineSeparator>
                    <TimelineContent fontWeight={"600"} >+ RM 5000</TimelineContent>
                    <TimelineContent color={colors.grey[300]}>22 Jan 2024</TimelineContent>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineSeparator><TimelineDot sx={{background:colors.primary[700]}} /></TimelineSeparator>
                    <TimelineContent fontWeight={"600"} >+ RM 2000</TimelineContent>
                    <TimelineContent color={colors.grey[300]}>18 Dec 2023</TimelineContent>
                  </TimelineItem>

                </Timeline>

              </Grid>

              <Grid item fontSize={20} fontWeight={700} xs={6}>Date Time</Grid>

              <Grid item>
                
              </Grid>

            </Grid>


          </Grid>
          

            {/* <TextField
              autoFocus
              margin="dense"
              label="Dealer"
              type="text"
              name="dealer"
              fullWidth
              value={formData.dealer}
              onChange={handleInputChange}
              error={Boolean(errors.dealer)}
              helperText={errors.dealer}
            />
            <TextField
              margin="dense"
              label="Earmark"
              type="text"
              name="earmark"
              fullWidth
              value={formData.earmark}
              onChange={handleInputChange}
              error={Boolean(errors.earmark)}
              helperText={errors.earmark}
            />
            <TextField
              margin="dense"
              label="Reason"
              type="text"
              name="reason"
              fullWidth
              value={formData.reason}
              onChange={handleInputChange}
              error={Boolean(errors.reason)}
              helperText={errors.reason}
            /> */}
          {/* Add more fields as needed */}
        </form>

      </Grid>


      
        
        
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button  variant="contained" type="submit" onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions> */}
    </Dialog>

      
  );
}

export default AddEarmarkDialogInput;

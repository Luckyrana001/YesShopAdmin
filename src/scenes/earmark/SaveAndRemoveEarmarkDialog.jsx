
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
import { useEffect } from 'react';
import { selectedItems } from '../../config/AppConfig';
import { useAtom } from "jotai";
import DebugLog from '../../utils/DebugLog';

function SaveAndRemoveEarmarkDialog({ open, onClose, onDialogButtonClick ,onDialogRemoveButtonClick , data , earmarkTimeline}) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedItem, setSelectedItem] = useAtom(selectedItems);
  // const [earmarks, setEarmark] = useState('');
  // const [reasons, setReason] = useState('');
  const [earmarkTimelineDetails, setearmarkTimelineDetails] = useState([]);
  let earmarkInitialValue = ''
  let reasonInitialValue = ''

   
  useEffect(() => {
    if(data) {
       //  earmarkInitialValue = data.earmark
       //  reasonInitialValue = data.reason
       //  setEarmark(data.earmark)
       //  setReason(data.reason) 

         const value = {
          earmark: data.earmark,
          reason: data.reason,
         }
         setFormData(value)
       
    }
    
    if(earmarkTimeline) {
      setearmarkTimelineDetails(earmarkTimeline)
    }
   
   // setFormData(earmarks,reasons)
    setDialogOpen(open);
    
  }, [open,data]);
  
  const [formData, setFormData] = useState({
    //dealer: '',
      earmark: '',
      reason: '',
  });
  const [errors, setErrors] = useState({});

  const [dialogOpen, setDialogOpen] = useState(open);
  const handleInputChange = (e) => {
    const {  name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };


//   const handleSubmit = () => {
//     // Handle form submission
//     console.log(formData);
//     // Close the dialog
//     onClose();
//   };


const handleRemove = (e) => {
  e.preventDefault();
    // Close the dialog
    onClose();

    onDialogRemoveButtonClick(selectedItem);
}

const handleSubmit = (e) => {
 
    e.preventDefault();
    // Validation logic
    const newErrors = {};

    DebugLog("formData.earmark.trim() ======="+formData.earmark)
    DebugLog("formData.earmark.trim() ======="+formData.reason.trim())
    
    if (!formData.earmark) {
      newErrors.earmark = 'Earmark is required';
     } 

    if (!formData.reason.trim()) {
        newErrors.reason = 'Reason is required';
       }
    if (Object.keys(newErrors).length === 0) {
      // Form is valid, submit the data
      console.log('Form data:', formData);

       // Close the dialog
      onClose();

      onDialogButtonClick(selectedItem, formData.earmark,formData.reason);

      
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
          <Grid container justifyContent="center" alignItems="center" item ><Typography fontSize={"16px"} fontWeight={"400"} pb={4}>{selectedItem.name}</Typography></Grid>
        </Grid>

        <form >

      
          
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
            margin="dense"
            label="Earmark"
            type="number" 
            name="earmark"
            fullWidth
            //defaultValue={earmarks}
            value={formData.earmark}
          // value={earmarks}
            onChange={handleInputChange}
            error={Boolean(errors.earmark)}
            helperText={errors.earmark}
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
            margin="dense"
            label="Reason"
            type="text"
            name="reason"
            fullWidth
            //defaultValue={reasons}
            value={formData.reason}
            //value={reasons}
            onChange={handleInputChange}
            error={Boolean(errors.reason)}
            helperText={errors.reason}
          />
              </Grid>
          </Grid>

          <Stack direction="row" pt={2} spacing={2} justifyContent={"center"}>

              <CustomButton
                btnBG={colors.primary[900]}
                btnColor={colors.grey[100]}
                btnTxt={"Remove Earmark"}
                btnBorder={"1px solid"+colors.primary[800]}
                onClick={handleRemove}
              ></CustomButton>

              <CustomButton
                btnBG={colors.primary[100]}
                btnColor={colors.grey[900]}
                btnTxt={"Save Earmark "}
                btnBorder={"1px solid"+colors.primary[100]}
                onClick={handleSubmit}
              ></CustomButton>

            </Stack>

            <Grid container xs={8}>
              
              <Grid item pt={4} fontSize={20} fontWeight={700} xs={6}>Activity</Grid>

              <Grid item xs={12} justifyitem={"flex-start"} alignitem={"flex-start"}>
              {earmarkTimelineDetails.length > 0 ? (
                <Timeline
                  sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                      flex: 0,
                      padding: 0,
                    },
                  }}
                >
                  
             {earmarkTimelineDetails.map((row) => (
                 
                 
                 <TimelineItem  key={row.id}>
                    <TimelineSeparator>
                  <TimelineDot sx={{background:colors.primary[100], width:"14px", height:"14px", marginTop:"70%"  }} />
                    <TimelineConnector sx={{ background:colors.primary[700], width:"1px", }} />
                    </TimelineSeparator>
                    <TimelineContent fontWeight={"600"} >+ {row.earmark}</TimelineContent>
                    <TimelineContent color={colors.grey[300]}>{row.date}</TimelineContent>
                  </TimelineItem>

                   ))}

               
                 
                </Timeline>
   ) : (
    ''
   )}
              </Grid>

              {/* <Grid item fontSize={20} fontWeight={700} xs={6}>Date Time</Grid> */}

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

export default SaveAndRemoveEarmarkDialog;

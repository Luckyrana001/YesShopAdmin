
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Grid, Typography } from '@mui/material';

function AddEarmarkDialogInput({ open, onClose }) {
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
      <Box>
      <Grid container justifyContent="center" alignItems="center" item ><Typography variant="h6"><b>Add Earmark</b></Typography></Grid>  
      <Grid container justifyContent="center" alignItems="center" item ><Typography variant="h6">Please specify Earmark for the dealer</Typography></Grid>
      </Box>
        <form onSubmit={handleSubmit}>
          <TextField
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
          />
          {/* Add more fields as needed */}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button  variant="contained" type="submit" onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEarmarkDialogInput;

// CustomDialog.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Grid, Typography } from '@mui/material';

function AddEarmarkDialogInput({ open, onClose }) {
  const [formData, setFormData] = useState({
    dealer: '',
    earmark: '',
    reason: '',
    // Add more fields as needed
  });

  const handleInputChange = (e) => {
    const { dealer, value } = e.target;
    setFormData({ ...formData, [dealer]: value });
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log(formData);
    // Close the dialog
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
     
      <DialogContent>
      <Box>
      <Grid container justifyContent="center" alignItems="center" item ><Typography variant="h6"><b>Add Earmark</b></Typography></Grid>  
      <Grid container justifyContent="center" alignItems="center" item ><Typography variant="h6">Please specify Earmark for the dealer</Typography></Grid>
      </Box>
        <form>
          <TextField
            autoFocus
            margin="dense"
            label="dealer"
            type="text"
            name="Dealer"
            fullWidth
            value={formData.dealer}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="earmark"
            type="text"
            name="Earmark"
            fullWidth
            value={formData.earmark}
            onChange={handleInputChange}
          />
           <TextField
            margin="dense"
            label="reason"
            type="text"
            name="Reason"
            fullWidth
            value={formData.earmark}
            onChange={handleInputChange}
          />
          {/* Add more fields as needed */}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEarmarkDialogInput;

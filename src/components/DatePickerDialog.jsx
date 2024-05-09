import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';


import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DebugLog from '../utils/DebugLog';

const CustomDatePickerDialog = ({ open, onClose, onSelect }) => {
  const [selectedDate, setSelectedDate] = React.useState(dayjs('2022-04-17'));

  const handleClose = () => {
    DebugLog("selectedDate  "+dayjs(selectedDate).format('DD/MM/YYYY'))
    onClose();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
   
  };

  const handleConfirm = () => {
    onSelect(dayjs(selectedDate).format('DD/MM/YYYY'));
    DebugLog("selectedDate  "+selectedDate)
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select Date</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
           defaultValue={dayjs('2022-04-17')}
            label="Choose Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
           
          />
           </DemoContainer>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDatePickerDialog;

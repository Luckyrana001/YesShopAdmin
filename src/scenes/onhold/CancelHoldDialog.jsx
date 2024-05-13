import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Grid, Typography } from '@mui/material';

const CancelHoldDialog = ({ open, onClose }) => {
    const [attachment, setAttachment] = useState(null);
    const [comment, setComment] = useState('');

    const handleAttachmentChange = (event) => {
        const file = event.target.files[0];
        setAttachment(file);
    };

    const handleCommentChange = (event) => {
        const value = event.target.value;
        setComment(value);
    };

    const handleSubmit = () => {
        // Handle form submission here
        console.log('Attachment:', attachment);
        console.log('Comment:', comment);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" >
            <DialogTitle>
                <Typography variant="h6"><b>Cancel Hold</b></Typography>
            </DialogTitle>
            <DialogContent>
                <Box mb={2}>
                    <Typography variant="subtitle1">Attachment (Optional)</Typography>
                    <Button variant="contained" component="label">
                        Upload File
                        <input type="file" hidden onChange={handleAttachmentChange} />
                    </Button>
                </Box>
                <Box mb={2}>
                    <Typography variant="subtitle1">Comment</Typography>
                    <TextField
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        value={comment}
                        onChange={handleCommentChange}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelHoldDialog;
import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, colors } from '@mui/material';
import CustomButton from '../../components/CustomButton';

import {  useTheme } from "@mui/material";
import { tokens } from "../../theme";
const ToolbarFilterButton = ({ options, defaultOption, onChange }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    handleClose();
    onChange(option);
  };

  return (
    <Box>


      <CustomButton
                  btnBG={colors.grey[900]}
                  btnColor={colors.grey[100]}
                  btnStartIcon={
                    <img src="../../assets/common/Filter.svg" width={22} />
                  }
                  btnEndIcon={
                    <img src="../../assets/common/Arrow-down.svg" height={8} />
                  }
                  btnTxt={"FILTER"}
                  onClick={handleClick}
                ></CustomButton>  
      
      
      {/* <Button
        variant="contained"
        onClick={handleClick}
        endIcon={<i className="fas fa-filter"></i>} // You can use your own filter icon
      >
        Filter
      </Button> */}



      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleOptionSelect(option)}
            selected={option === selectedOption}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ToolbarFilterButton;

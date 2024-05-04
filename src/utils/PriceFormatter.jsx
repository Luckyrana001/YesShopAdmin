import { Box, Typography } from "@mui/material";
import React from "react";

function PriceFormatter({ price }) {
  if (typeof price === "number" && !isNaN(price)) {
    // Assuming price is a number
    const formattedPrice = price.toFixed(2).toLocaleString();

    return (
      <Box>
        <Typography sx={{ display: "inline-flex", marginRight: "3%" }}>
        <span style={{ fontSize: '11px' }}>RM</span>
        </Typography>
        {formattedPrice}
      </Box>
    );
  } else {
    // Return a default message or empty div if price is not valid
    return (
      <Box>
        <Typography sx={{ display: "inline-flex", marginRight: "3%" }}>
          RM 00.00
        </Typography>
      </Box>
    );
  }
}

export default PriceFormatter;

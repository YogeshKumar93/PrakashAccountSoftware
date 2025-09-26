import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import myImage from "../assets/Images/aeps-guidelines-new.png";
import myLogo from "../assets/Images/logo(1).png";
import atmIcon from "../assets/Images/aeps_print.png";
import Aeps1 from "./Aeps1";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const Aeps2 = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" color="primary">
        Complete Aeps2 Onboarding using mobile app
      </Typography>
    </Box>
  );
};

export default Aeps2;

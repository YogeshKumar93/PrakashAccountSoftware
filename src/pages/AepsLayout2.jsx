import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import myImage from "../assets/Images/aeps-guidelines-new.png";
import myLogo from "../assets/Images/PPALogo.jpeg";
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

const AepsLayout2 = () => {
  const [step, setStep] = useState(1);

  if (step === 1) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Box
          component="img"
          src={myImage}
          alt="Guidelines"
          sx={{
            width: "100%",
            maxWidth: 700,
            height: 400,
            borderRadius: 2,
            mb: 2,
            pt: 8,
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #ddd",
            pt: 2,
          }}
        >
          <Box component="img" src={myLogo} alt="Logo" sx={{ height: 40 }} />
          <Button
            variant="contained"
            sx={{ bgcolor: "#9d72f0", "&:hover": { bgcolor: "#8756e5" } }}
            onClick={() => setStep(2)}
          >
            Accept
          </Button>
        </Box>
      </Box>
    );
  }

  if (step === 2) {
    return <Aeps1 />;
  }

  return null;
};

export default AepsLayout2;

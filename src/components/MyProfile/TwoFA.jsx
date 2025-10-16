import React, { useContext, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  useTheme,
  IconButton,
  InputAdornment,
} from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import CommonModal from "../common/CommonModal";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";
// import CommonModal from "./CommonModal";

const TwoFA = ({ open, onClose }) => {
  const theme = useTheme();
  const authCtx = useContext(AuthContext);
  const loaduserpofile=authCtx.loadUserProfile
  const user = authCtx?.user;
  const username = `P2PAE${user?.id}`;
  const { showToast } = useToast();

  const handleTwoFA = async () => {
    try {
      const response = await apiCall(
        "POST",
        ApiEndpoints.CHANGE_TWO_FA,
      );

      showToast(response?.message || "Two FA changed successfully");
      loaduserpofile()
      onClose()
    } catch (error) {
      showToast(error || "Something went wrong", "error");
      console.error(error);
    }
  };

  return (
    <>
      {" "}
      <CommonModal
        open={open}
        onClose={onClose}
        title="Change MPIN"
        iconType="help"
        showCloseButton
        footerButtons={[]}
        size="small"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          width="100%"
          maxWidth="350px"
          mx="auto"
        >
          {/* Conditional text message */}
          <Typography variant="body1" align="center">
            {user?.two_fa === "MPIN"
              ? "Are you sure you want to change from MPIN to OTP?"
              : "Are you sure you want to change from OTP to MPIN?"}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={handleTwoFA}
            sx={{
              bgcolor: "#EA5E5A",
              py: 1.25,
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": { bgcolor: "#d45552" },
            }}
          >
            {user?.two_fa === "MPIN" ? "Change to OTP" : "Change to MPIN"}
          </Button>
        </Box>
      </CommonModal>
    </>
  );
};

export default TwoFA;

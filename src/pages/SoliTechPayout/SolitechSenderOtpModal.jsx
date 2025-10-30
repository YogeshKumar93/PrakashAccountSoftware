// src/pages/Soliteck/SoliTechSenderOtpModal.js
import React, { useRef, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import CommonModal from "../../components/common/CommonModal";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";

const SoliTechSenderOtpModal = ({ open, onClose, otpData, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const inputRefs = useRef([]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      showToast("Please enter a valid 6-digit OTP", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        mobile_number: otpData?.mobile_number,
        otp: otp,
        otp_ref: otpData?.otp_ref,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.SOLITECH_VERIFY_OTP,
        payload
      );

      if (response?.status) {
        showToast("Sender verified successfully!", "success");
        onVerified?.(); // e.g., refetch sender
        onClose();
      } else {
        showToast(error?.message || "Invalid OTP, please try again.", "error");
      }
    } catch (err) {
      showToast("OTP verification failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Verify OTP"
      iconType="info"
      size="small"
      dividers
      loading={submitting}
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: onClose,
          disabled: submitting,
        },
        {
          text: submitting ? "Verifying..." : "Verify",
          variant: "contained",
          color: "primary",
          onClick: handleVerify,
          disabled: submitting || otp.length !== 6,
        },
      ]}
    >
      <Typography variant="body2" sx={{ mb: 2 }}>
        Please enter the 6-digit OTP sent to{" "}
        <strong>{otpData?.mobile_number}</strong>
      </Typography>
      <Box display="flex" justifyContent="center" gap={1}>
        {[...Array(6)].map((_, i) => (
          <TextField
            key={i}
            inputRef={(el) => (inputRefs.current[i] = el)} // store refs
            value={otp[i] || ""}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (!val && otp[i]) {
                // Handle delete
                const newOtp = otp.split("");
                newOtp[i] = "";
                setOtp(newOtp.join(""));
                if (i > 0) inputRefs.current[i - 1].focus();
                return;
              }

              if (val) {
                const newOtp = otp.split("");
                newOtp[i] = val;
                setOtp(newOtp.join("").slice(0, 6));
                if (i < 5) inputRefs.current[i + 1]?.focus(); // move to next
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !otp[i] && i > 0) {
                inputRefs.current[i - 1]?.focus();
              }
            }}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "20px",
                width: "40px",
                height: "40px",
              },
            }}
          />
        ))}
      </Box>
    </CommonModal>
  );
};

export default SoliTechSenderOtpModal;

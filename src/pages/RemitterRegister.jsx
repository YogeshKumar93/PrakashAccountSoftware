import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import OtpInput from "./OtpInput";
import AEPS2FAModal from "../components/AEPS/AEPS2FAModal";
import AuthContext from "../contexts/AuthContext";

const RemitterRegister = ({
  open,
  onClose,
  mobile,
  onSuccess,
  referenceKey,
}) => {
  const { showToast } = useToast();
  const authCtx = useContext(AuthContext);
  const loc = authCtx?.location;

  const [formData, setFormData] = useState({
    mobile_number: mobile || "",
    aadhaar_number: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [otpReferenceKey, setOtpReferenceKey] = useState(null);
  const [kycReferenceKey, setKycReferenceKey] = useState(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [aeps2faOpen, setAeps2faOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [aadhaar, setAadhaar] = useState(null);
  const [fingerprintData, setFingerprintData] = useState("");

  useEffect(() => {
    if (mobile) {
      setFormData((prev) => ({ ...prev, mobile_number: mobile }));
      // Reset all OTP/AEPS states when mobile changes
      setOtp("");
      setOtpReferenceKey(null);
      setKycReferenceKey(null);
      setOtpModalOpen(false);
      setAeps2faOpen(false);
    }
  }, [mobile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSendOtp = async () => {
    setSubmitting(true);
    setErrors({});
    try {
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.DMT1_REGISTER_REMMITER,
        { ...formData, reference_key: referenceKey }
      );

      if (response) {
        setOtpReferenceKey(response.data.referenceKey);
        setOtpModalOpen(true);
      } else {
        showToast(error?.errors || error?.message, "error");
      }
    } catch (err) {
      showToast(err?.message || "Unexpected error", "error");
      setErrors(err?.response?.data?.errors || {});
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateOtp = async (enteredOtp) => {
    setSubmitting(true);
    try {
      const { response } = await apiCall(
        "post",
        ApiEndpoints.VALIDATE_REMITTER_DMT1,
        {
          otp: enteredOtp,
          reference_key: otpReferenceKey,
          rem_number: mobile,
        }
      );

      if (response) {
        showToast(response?.message || "OTP validated", "success");
        setKycReferenceKey(response?.data?.referenceKey);
        setOtpModalOpen(false);
        setAeps2faOpen(true);
      }
    } catch (err) {
      showToast("OTP validation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAPICall = async (scanData) => {
    setSubmitting(true);
    const payload = {
      AadhaarNumber: formData.aadhaar_number,
      mobile_number: formData.mobile_number,
      pidData: scanData.pidData || scanData.pid,
      pidDataType: scanData.pidDataType || scanData.type,
      ci: scanData.ci || scanData.cI,
      dc: scanData.dc || scanData.dC,
      dpId: scanData.dpId || scanData.dpID,
      fCount: scanData.fCount,
      hmac: scanData.hmac || scanData.hMac,
      mc: scanData.mc || scanData.mC,
      errInfo: scanData.errInfo,
      mi: scanData.mi || scanData.mI,
      nmPoints: scanData.nmPoints,
      qScore: scanData.qScore,
      rdsId: scanData.rdsId,
      rdsVer: scanData.rdsVer,
      sessionKey: scanData.sessionKey,
      srno: scanData.srno,
      latitude: loc?.lat || 0,
      longitude: loc?.long || 0,
      amount: formData.amount,
      pf: "web",
      reference_key: kycReferenceKey,
      operator: 15,
    };

    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.DMT1_KYC_REMITTER,
        payload
      );

      if (error) showToast(error?.message, "error");
      else {
        showToast(
          response?.data?.message || "Success",
          response?.data?.status ? "success" : "error"
        );
        setAeps2faOpen(false);
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return aeps2faOpen ? (
    <AEPS2FAModal
      open={aeps2faOpen}
      onClose={() => setAeps2faOpen(false)}
      aadhaar={formData.aadhaar_number}
      setAadhaar={setAadhaar}
      formData={formData}
      onFingerSuccess={handleAPICall}
      fingerData={setFingerprintData}
      setFormData={setFormData}
      type="registeRemmitter"
      title="Remitter KYC"
    />
  ) : (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Register Remitter</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Mobile Number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              fullWidth
              disabled
            />
            <TextField
              label="Aadhaar Number"
              name="aadhaar_number"
              value={formData.aadhaar_number}
              onChange={handleChange}
              fullWidth
              error={!!errors.aadhaar_number}
              helperText={errors.aadhaar_number}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleRegisterSendOtp}
            disabled={submitting}
            variant="contained"
            color="primary"
          >
            {submitting ? "Sending OTP..." : "Send OTP"}
          </Button>
        </DialogActions>
      </Dialog>

      {otpModalOpen && (
        <OtpInput
          open={otpModalOpen}
          onClose={() => setOtpModalOpen(false)}
          otp={otp}
          setOtp={setOtp}
          onSubmit={handleValidateOtp}
          submitting={submitting}
        />
      )}
    </>
  );
};

export default RemitterRegister;

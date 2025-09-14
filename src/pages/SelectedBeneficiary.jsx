import { useState, useContext } from "react";
import {
  Paper,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import OTPInput from "react-otp-input";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";

const SelectedBeneficiary = ({ beneficiary, senderId, senderMobile }) => {
  const { location } = useContext(AuthContext);
  const [transferMode, setTransferMode] = useState("IMPS");
  const [amount, setAmount] = useState("");
  const [otpRef, setOtpRef] = useState(null);
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const [loading, setLoading] = useState(false);
const {showToast} = useToast()
  if (!beneficiary) return null;

  const handleGetOtp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      apiErrorToast("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        mobile_number: senderMobile,
        beneficiary_id: beneficiary.id,
        amount,
      };
      const { error, response } = await apiCall("post", ApiEndpoints.PAYOUT_OTP, payload);
      if (error) apiErrorToast(error);
      else {
        showToast("OTP sent successfully!","success");
        setOtpRef(response?.data?.otp_ref || null);
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!otp || otp.length !== 6) {
      apiErrorToast("Enter the 6-digit OTP");
      return;
    }
    if (!mpin || mpin.length !== 6) {
      apiErrorToast("Enter the 6-digit M-PIN");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        sender_id: senderId,
        beneficiary_id: beneficiary.id,
        beneficiary_name: beneficiary.beneficiary_name,
        account_number: beneficiary.account_number,
        ifsc_code: beneficiary.ifsc_code,
        bank_name: beneficiary.bank_name,
        mobile_number: beneficiary.mobile_number,
        operator: 11,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        otp,
        otp_ref: otpRef,
        mop: transferMode,
        mpin,
      };

      const { error, response } = await apiCall("post", ApiEndpoints.PAYOUT, payload);
      if (response) {
        okSuccessToast("Payout successful!");
        setAmount("");
        setOtp("");
        setMpin("");
        setOtpRef(null);
      } else {
        apiErrorToast(error || "Something went wrong");
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 0, mt: 2, borderRadius: 2, overflow: "hidden" }}>
      {/* Header */}
   <Box
        sx={{
          bgcolor: "#0078B6",
          color: "#fff",
          textAlign: "center",
          py: 1,
          px:2
        }}
      >        <Typography variant="subtitle1" fontWeight="bold" color="#fff" sx={{textAlign:"left"}}>
          Selected Beneficiary
        </Typography>
      </Box>

      {/* Beneficiary Details */}
<Box sx={{ mx: 2, my: 2, p: 1, bgcolor: "#f0f8ff", borderRadius: 2 }}>
        {[
          { label: "Name", value: beneficiary.beneficiary_name },
          { label: "Account Number", value: beneficiary.account_number },
          { label: "Bank", value: beneficiary.bank_name },
          { label: "IFSC", value: beneficiary.ifsc_code },
        ].map((item, idx) => (
          <Box key={idx} display="flex" mb={1}>
            <Typography sx={{ width: "150px", fontWeight: 500,fontSize:"14px" }}>{item.label}:</Typography>
            <Typography sx={{fontSize:"12px"}}>{item.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Transfer Mode */}
      <Box textAlign="center" mb={0}>
        <Typography variant="body2" fontWeight="bold" mb={0}>
          Transfer Mode
        </Typography>
        <RadioGroup
          row
          value={transferMode}
          onChange={(e) => setTransferMode(e.target.value)}
          sx={{ justifyContent: "center" }}
        >
          <FormControlLabel value="IMPS" control={<Radio />} label="IMPS" />
          <FormControlLabel value="NEFT" control={<Radio />} label="NEFT" />
        </RadioGroup>
      </Box>

      {/* Amount / OTP / M-PIN */}
      {!otpRef ? (
        <TextField
          label="Amount"
          type="number"
          fullWidth
          variant="outlined"
          size="small"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{
            endAdornment: (
           <InputAdornment position="end">
  <Button
    variant="contained"
    size="small"
    onClick={handleGetOtp}
    disabled={loading}
    sx={{
      minWidth: "60px",   
      px: 1,            
      py: 0.5,            
      fontSize: "0.75rem", 
      borderRadius: 1,     
    }}
  >
    {loading ? "..." : "Get OTP"}
  </Button>
</InputAdornment>

            ),
          }}
        />
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {/* OTP */}
          <Box>
            <Typography variant="body2" mb={0.5} sx={{px:2}}>Enter OTP</Typography>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputType="tel"
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: 40,
                height: 40,
                margin: "0 5px",
                fontSize: 18,
                border: "1px solid #D0D5DD",
                borderRadius: 6,
                textAlign: "center",
              }}
            />
          </Box>

          {/* M-PIN */}
          <Box>
            <Typography variant="body2" mb={0.5} sx={{px:2}}>Enter M-PIN</Typography>
            <OTPInput
              value={mpin}
              onChange={setMpin}
              numInputs={6}
              inputType="password"
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: 40,
                height: 40,
                margin: "0 5px",
                fontSize: 18,
                border: "1px solid #D0D5DD",
                borderRadius: 6,
                textAlign: "center",
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="success"
            onClick={handleProceed}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed"}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default SelectedBeneficiary;

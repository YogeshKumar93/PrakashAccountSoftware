import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  MenuItem,
} from "@mui/material";
import OTPInput from "react-otp-input";
import AuthContext from "../../contexts/AuthContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../../components/common/CommonModal";
import Loader from "../../components/common/Loader";

const SoliTechBeneficiaryDetails = ({
  open,
  onClose,
  beneficiary,
  senderMobile,
  senderId,
  sender,
  onPayoutSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [mpin, setMpin] = useState("");
  const [transferMode, setTransferMode] = useState("IMPS");
  const [purposes, setPurposes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [loadingPurposes, setLoadingPurposes] = useState(false);

  const { location, loadUserProfile } = useContext(AuthContext);
  const { showToast } = useToast();

  if (!beneficiary) return null;

  // Fetch purposes on mount
  useEffect(() => {
    const fetchPurposes = async () => {
      setLoadingPurposes(true);
      try {
        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.GET_PURPOSES
        );
        if (response) {
          const data = response?.data || [];
          setPurposes(data);
          if (data.length > 0) setSelectedPurpose(data[0].id);
        } else showToast(error || "Failed to load purposes", "error");
      } catch (err) {
        showToast("Error loading purposes", "error");
      } finally {
        setLoadingPurposes(false);
      }
    };
    fetchPurposes();
  }, []);

  // Proceed payout
  const handleProceed = async () => {
    if (!mpin || mpin.length !== 6)
      return showToast("Please enter the 6-digit M-PIN", "error");

    if (!amount || parseFloat(amount) <= 0)
      return showToast("Please enter a valid amount", "error");

    if (!selectedPurpose) return showToast("Please select a purpose", "error");

    setLoading(true);
    try {
      const selectedPurposeObj = purposes.find(
        (p) => p.id === Number(selectedPurpose)
      );
      const purposeType = selectedPurposeObj?.type || "N/A";

      const payload = {
        mpin,
        beneficiary_name: beneficiary.beneficiary_name,
        bank_name: beneficiary.bank_name,
        account_number: beneficiary.account_number,
        ifsc_code: beneficiary.ifsc_code,
        operator: 89,
        mop: transferMode,
        latitude: location?.lat || "",
        longitude: location?.long || "",
        amount,
        soliteck_id: beneficiary.soliteck_id,
        mobile_number: senderMobile,
        purpose: purposeType,
        purpose_id: selectedPurpose,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.SOLITECH_PAYOUT,
        payload
      );

      if (response) {
        showToast(response?.message || "Payout successful!", "success");
        loadUserProfile();

        const payoutData = {
          ...(response?.data || {}),
          purpose: purposeType,
        };

        onPayoutSuccess(payoutData);
        setAmount("");
        setMpin("");
        onClose();
      } else {
        showToast(error?.message || "Payout failed", "error");
      }
    } catch (err) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle amount input
  const handleChangeAmount = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (
        sender?.rem_limit &&
        parseFloat(value) > parseFloat(sender.rem_limit)
      ) {
        showToast(
          `Amount exceeds remaining limit of ${sender.rem_limit}`,
          "warning"
        );
        return;
      }
      setAmount(value);
    }
  };

  // Modal custom content
  const customContent = (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Beneficiary Info */}
      <Box sx={{ bgcolor: "#f0f8ff", p: 2, borderRadius: 2 }}>
        {[
          { label: "Name", value: beneficiary.beneficiary_name },
          { label: "Account Number", value: beneficiary.account_number },
          { label: "Bank", value: beneficiary.bank_name },
          { label: "IFSC", value: beneficiary.ifsc_code },
        ].map((item, index) => (
          <Box key={index} display="flex" mb={1}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ width: "160px" }}
            >
              {item.label}
            </Typography>
            <Typography variant="body2">{item.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Transfer Mode + Purpose */}
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Box>
          <Typography variant="body2" fontWeight="bold" mb={0.5}>
            Transfer Mode
          </Typography>
          <RadioGroup
            row
            value={transferMode}
            onChange={(e) => setTransferMode(e.target.value)}
          >
            <FormControlLabel value="IMPS" control={<Radio />} label="IMPS" />
            <FormControlLabel value="NEFT" control={<Radio />} label="NEFT" />
          </RadioGroup>
        </Box>

        <Box>
          <Typography variant="body2" fontWeight="bold" mb={0.5}>
            Purpose
          </Typography>
          <TextField
            select
            size="small"
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value)}
            sx={{ minWidth: "180px" }}
            SelectProps={{ native: true }}
          >
            {loadingPurposes ? (
              <option>Loading...</option>
            ) : (
              purposes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.type}
                </option>
              ))
            )}
          </TextField>
        </Box>
      </Box>

      {/* Amount */}
      <TextField
        label="Amount"
        type="text"
        variant="outlined"
        size="small"
        fullWidth
        value={amount}
        onChange={handleChangeAmount}
      />

      {/* M-PIN */}
      {amount && parseFloat(amount) > 0 && (
        <Box>
          <Typography variant="body2" mb={0.5}>
            Enter 6-digit M-PIN
          </Typography>
          <OTPInput
            value={mpin}
            onChange={setMpin}
            numInputs={6}
            inputType="password"
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              width: "40px",
              height: "40px",
              margin: "0 5px",
              fontSize: "18px",
              border: "1px solid #D0D5DD",
              borderRadius: "6px",
              textAlign: "center",
            }}
          />
        </Box>
      )}
    </Box>
  );

  return (
    <Loader loading={loading}>
      <CommonModal
        open={open}
        onClose={onClose}
        title="Send Money"
        iconType="info"
        size="small"
        customContent={customContent}
        loading={loading}
        footerButtons={[
          {
            text: "Cancel",
            variant: "outlined",
            onClick: onClose,
            disabled: loading,
          },
          {
            text: loading ? "Processing..." : "Proceed",
            variant: "contained",
            color: "success",
            onClick: handleProceed,
            disabled: loading,
          },
        ]}
      />
    </Loader>
  );
};

export default SoliTechBeneficiaryDetails;

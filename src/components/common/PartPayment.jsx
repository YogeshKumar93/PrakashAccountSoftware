import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonMpinModal from "../common/CommonMpinModal";
import AuthContext from "../../contexts/AuthContext";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import { apiCall } from "../../api/apiClient";

const PartPayment = ({ open, handleClose, data = {}, refreshData }) => {
  const { location } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    ca_number: "",
    name: "",
    amount: "",
    latitude: location?.lat || 0,
    longitude: location?.long || 0,
    operator: 88,
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" })); // clear error on change
  };

  const validate = () => {
    const errors = {};

    if (!formValues.ca_number.trim())
      errors.ca_number = "CA Number is required";
    if (!formValues.name.trim()) errors.name = "Name is required";
    if (!formValues.amount.trim()) errors.amount = "Amount is required";
    else if (Number(formValues.amount) <= 0)
      errors.amount = "Amount must be greater than 0";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmPayment = async (mpin) => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = { ...formValues, mpin };
      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.PART_PAYMENT,
        payload
      );

      if (response) {
        okSuccessToast(response?.data?.message || "Payment successful!");
        refreshData?.();
        handleClose?.();
      } else {
        apiErrorToast(error?.message || "Payment failed!");
      }
    } catch (err) {
      apiErrorToast(err.message || "Payment failed!");
    } finally {
      setSubmitting(false);
      setMpinModalOpen(false);
    }
  };

  const isFormComplete =
    formValues.ca_number.trim() &&
    formValues.name.trim() &&
    formValues.amount.trim();

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2} mb={3}>
        <TextField
          label="Name"
          value={formValues.name}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
          error={!!formErrors.name}
          helperText={formErrors.name}
        />

        <TextField
          label="CA Number"
          value={formValues.ca_number}
          onChange={(e) => handleChange("ca_number", e.target.value)}
          fullWidth
          error={!!formErrors.ca_number}
          helperText={formErrors.ca_number}
        />

        <TextField
          label="Amount"
          type="text"
          value={formValues.amount}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {
              handleChange("amount", val);
            }
          }}
          fullWidth
          error={!!formErrors.amount}
          helperText={formErrors.amount}
        />

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setMpinModalOpen(true)}
            disabled={submitting || !isFormComplete}
          >
            {submitting ? "Processing..." : "Pay"}
          </Button>
        </Box>
      </Box>

      {/* MPIN confirmation modal */}
      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        title="Enter MPIN to Confirm Payment"
        mPinCallBack={handleConfirmPayment}
      />

      {/* Loader */}
      <Backdrop open={submitting} sx={{ zIndex: 1200, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default PartPayment;

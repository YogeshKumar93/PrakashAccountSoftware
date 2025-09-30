import React, { useState,useEffect  } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../common/CommonModal";
const CreateEditWhiteListedAccountModal = ({
  open,
  onClose,
  onFetchRef,
  initialData = null,
}) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    acc_no: "",
    acc_name: "",
    acc_type: "",
    limit: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const accountTypes = [
    { label: "Savings", value: "saving" },
    { label: "Current", value: "current" },
    { label: "Credit", value: "credit" },
  ];

  // Initialize form if editing
  useEffect(() => {
    if (initialData) setFormData(initialData);
    else
      setFormData({
        acc_no: "",
        acc_name: "",
        acc_type: "",
        limit: "",
      });
  }, [initialData]);

const handleChange = (field, value) => {
  if (field === "acc_no") {
    value = value.replace(/\D/g, ""); // allow only digits
    if (value.length > 16) value = value.slice(0, 16); // max 16 digits
  }
  setFormData((prev) => ({ ...prev, [field]: value }));
  setErrors((prev) => ({ ...prev, [field]: "" }));
};

  const validateForm = () => {
    const newErrors = {};

    // ✅ Account number: exactly 16 digits
if (!formData.acc_no) newErrors.acc_no = "Account number is required";
else if (formData.acc_no.length < 9 || formData.acc_no.length > 16)
  newErrors.acc_no = "Account number must be between 9 and 16 digits";

    if (!formData.acc_name) newErrors.acc_name = "Account name is required";

    if (!formData.acc_type) newErrors.acc_type = "Select account type";

    if (!formData.limit) newErrors.limit = "Limit is required";
    else if (isNaN(formData.limit)) newErrors.limit = "Limit must be a number";
    else if (Number(formData.limit) < 0)
      newErrors.limit = "Limit cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const endpoint = initialData
        ? ApiEndpoints.UPDATE_WHITE_LISTED_ACCOUNT
        : ApiEndpoints.CREATE_WHITE_LISTED_ACCOUNT;

      const { error, response } = await apiCall("POST", endpoint, formData);

      if (response) {
        showToast(
          response?.message ||
            (initialData
              ? "Account updated successfully"
              : "Account created successfully"),
          "success"
        );
        onFetchRef?.();
        onClose();
      } else {
        showToast(error?.message || "Operation failed", "error");
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      footerButtons={[]}
      title={
        initialData ? "Edit White Listed Account" : "Add Account To White List"
      }
    >
      <TextField
        label="Account Number"
        value={formData.acc_no}
        onChange={(e) => handleChange("acc_no", e.target.value)}
        fullWidth
        margin="normal"
         inputProps={{ maxLength: 16 }}
        error={!!errors.acc_no}
        helperText={errors.acc_no}
      />
      <TextField
        label="Account Name"
        value={formData.acc_name}
        onChange={(e) => handleChange("acc_name", e.target.value)}
        fullWidth
        margin="normal"
        error={!!errors.acc_name}
        helperText={errors.acc_name}
      />
      <TextField
        select
        label="Account Type"
        value={formData.acc_type}
        onChange={(e) => handleChange("acc_type", e.target.value)}
        fullWidth
        margin="normal"
        error={!!errors.acc_type}
        helperText={errors.acc_type}
      >
        {accountTypes.map((type) => (
          <MenuItem key={type.value} value={type.value}>
            {type.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Limit"
        value={formData.limit}
        onChange={(e) => handleChange("limit", e.target.value)}
        type="number"
        fullWidth
        margin="normal"
        error={!!errors.limit}
        helperText={errors.limit}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save"}
        </Button>
      </Box>
    </CommonModal>
  );
};

export default CreateEditWhiteListedAccountModal;

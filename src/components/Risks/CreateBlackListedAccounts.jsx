import React, { useState } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../common/CommonModal";
const CreateEditBlackListedAccountModal = ({
  open,
  onClose,
  onFetchRef,
  initialData = null, // agar edit hai toh yahan data aayega
}) => {
  const { showToast } = useToast();
  const isEdit = !!initialData; // true agar edit mode

  const [formData, setFormData] = useState({
    acc_no: initialData?.acc_no || "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    if (field === "acc_no") {
      value = value.replace(/\D/g, ""); // sirf digits
      if (value.length > 16) value = value.slice(0, 16);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.acc_no) newErrors.acc_no = "Account number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const endpoint = isEdit
        ? ApiEndpoints.UPDATE_BLACK_LISTED_ACCOUNT
        : ApiEndpoints.CREATE_BLACK_LISTED_ACCOUNT;

      const payload = isEdit ? { ...formData, id: initialData.id } : formData;

      const { error, response } = await apiCall("POST", endpoint, payload);

      if (response) {
        showToast(
          response?.message ||
            (isEdit
              ? "Account updated successfully"
              : "Account created successfully"),
          "success"
        );
        onFetchRef?.();
        onClose();
      } else {
        showToast(error?.message || "Failed to save account", "error");
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
        isEdit
          ? "Edit Account No To Black List "
          : "Add Account No To Black List "
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

export default CreateEditBlackListedAccountModal;

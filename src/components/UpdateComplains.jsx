import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

import CommonModal from "./common/CommonModal";
import AuthContext from "../contexts/AuthContext";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
const UpdateComplaint = ({ open, onClose, complaintId, onSuccess }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    remarks: "",
    status: "",
    priority: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const statusOptions = [
    { value: "open", label: "Open", color: "warning" },
    { value: "resolved", label: "Resolved", color: "success" },
    { value: "rejected", label: "Rejected", color: "error" },
  ];

  const validateForm = () => {
    const errors = {};

    if (!formData.remarks.trim()) {
      errors.remarks = "Remarks are required";
    }

    if (!formData.status) {
      errors.status = "Please select a status";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast("Please fix the form errors", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        id: complaintId,
        remark: formData.remarks,
        handler: user?.id,
        status: formData.status,
        // priority: formData.priority,
      };

      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.UPDATE_COMPLAINTS,
        payload
      );

      if (response) {
        showToast(
          response?.message || "Complaint updated successfully",
          "success"
        );
        onSuccess?.(); // refresh list
        onClose(); // close modal

        // Reset form
        setFormData({
          remarks: "",
          status: "",
          priority: "medium",
        });
      } else {
        showToast(error?.message || "Failed to update complaint", "error");
      }
    } catch (err) {
      console.error("Error updating complaint:", err);
      showToast("Something went wrong while updating complaint", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        remarks: "",
        status: "",
        priority: "medium",
      });
      setValidationErrors({});
      setComplaintDetails(null);
    }
  }, [open]);

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      title="Update Complaint"
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: onClose,
          disabled: submitting,
        },
        {
          text: submitting ? "Updating..." : "Update Complaint",
          variant: "contained",
          color: "primary",
          onClick: handleSubmit,
          disabled: submitting || loading,
          startIcon: submitting ? <CircularProgress size={16} /> : null,
        },
      ]}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ mt: 1 }}>
          {/* Update Form */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!validationErrors.status}>
                <InputLabel>Status *</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleInputChange("status")}
                  label="Status *"
                  disabled={submitting}
                  sx={{
                    height: "56px",
                    width: "300px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: `${option.color}.main`,
                            mr: 1.5,
                          }}
                        />
                        <Typography variant="body2">{option.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.status && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {validationErrors.status}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Remarks Field - Full Width */}
            <Grid item xs={12}>
              <TextField
                label="Remarks *"
                fullWidth
                multiline
                rows={4}
                value={formData.remarks}
                onChange={handleInputChange("remarks")}
                error={!!validationErrors.remarks}
                helperText={
                  validationErrors.remarks ||
                  "Provide detailed remarks about the complaint resolution"
                }
                disabled={submitting}
                placeholder="Enter detailed remarks about the complaint resolution, steps taken, and final outcome..."
                variant="outlined"
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "120px", // Consistent height
                    alignItems: "flex-start",
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </CommonModal>
  );
};

export default UpdateComplaint;

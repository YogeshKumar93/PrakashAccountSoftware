import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "./common/CommonModal";
import { useToast } from "../utils/ToastContext";
import { number } from "framer-motion";
const ComplaintForm = ({ txnId, onSuccess, open, onClose, type }) => {
  console.log("Rendering ComplaintForm with props:", { txnId, open, type });
  const [formData, setFormData] = useState({
    message: "",
    complaintType: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const { showToast } = useToast();

  const priorityLevels = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  const serviceTypes = [
    { value: "dmt", label: "DMT" },
    { value: "recharge", label: "Recharge" },
    { value: "payout", label: "Payout" },
    { value: "bill_payment", label: "Bill Payment" },
  ];
  console.log("ComplaintForm props - txnId:", txnId, "type:", type);
  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        message: "",
        complaintType: "",
        priority: "medium",
      });
      setValidationErrors({});
      setTransactionDetails(null);
    }
  }, [open]);

  // Fetch transaction details when txnId changes
  useEffect(() => {
    if (txnId?.id) {
      // Simulate fetching transaction details
      setTransactionDetails({
        id: txnId.id,
        txn_id: txnId.txn_id || `TXN${txnId.id}`,
        amount: txnId.amount || "₹0",
        status: txnId.status || "Pending",
        date: txnId.date || new Date().toLocaleDateString(),
        service: type || "dmt",
      });
    }
  }, [txnId, type]);

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.message.trim()) {
      errors.message = "Complaint message is required";
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

  // Submit complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!txnId?.id) {
      showToast("Invalid transaction selected", "error");
      return;
    }

    if (!validateForm()) {
      showToast("Please fix the form errors", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: txnId.id,
        message: formData.message,
        type: type,

        priority: formData.priority,
        txn_id: txnId.txn_id || `TXN${txnId.id}`,
        number: txnId.mobile_number,
      };
      console.log("Submitting complaint with payload:", payload);
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_COMPLAINTS,
        payload
      );

      if (response) {
        showToast(
          response.message || "Complaint created successfully",
          "success"
        );
        setFormData({
          message: "",
          complaintType: "",
          priority: "medium",
        });
        if (onSuccess) onSuccess(response.data);
        onClose();
      } else {
        showToast(error || "Failed to create complaint", "error");
      }
    } catch (err) {
      console.error("Complaint submission error:", err);
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal open={open} onClose={onClose} maxWidth="md" footerButtons={[]}>
      <Box component="form" onSubmit={handleSubmit}>
        {transactionDetails && (
          <Card sx={{ m: 3, mb: 2 }} variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Transaction ID:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {transactionDetails.txn_id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Amount:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {transactionDetails.amount}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color={
                      transactionDetails.status === "success"
                        ? "success.main"
                        : transactionDetails.status === "failed"
                        ? "error.main"
                        : "warning.main"
                    }
                  >
                    {transactionDetails.status}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Service Type:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {serviceTypes.find((st) => st.value === type)?.label ||
                      type}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Priority */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className="equal-input">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={handleInputChange("priority")}
                  label="Priority"
                >
                  {priorityLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Complaint Message */}
            <Grid item xs={12}>
              <TextField
                label="Complaint Details *"
                value={formData.message}
                onChange={handleInputChange("message")}
                error={!!validationErrors.message}
                helperText={
                  validationErrors.message ||
                  "Please provide detailed information about your issue"
                }
                required
                multiline
                rows={4}
                placeholder="Describe your issue in detail. Include relevant information like error messages, timestamps, etc."
                variant="outlined"
                fullWidth
                className="equal-input"
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button onClick={onClose} disabled={loading} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </Button>
          </Box>
        </Box>
      </Box>
    </CommonModal>
  );
};

export default ComplaintForm;

import React, { useState } from "react";
import { Typography, Box, TextField } from "@mui/material";
import { apiCall } from "../api/apiClient";
import CommonModal from "./common/CommonModal";
import Spinner from "./Spinner";
import { useToast } from "../utils/ToastContext";

const CommonDeleteModal = ({
  open,
  handleClose,
  selectedRow,
  onFetchRef,
  endpoint,
  title = "Delete Record",
  field = "name",
  payloadField = "id",
  confirmText = "Confirm",
  cancelText = "Cancel",
  enableRemark = false,
  method = "POST",
  requiredRemark = false,
  onSuccess,
  onError,
  customPayload = null, // NEW: Allow custom payload
  payloadBuilder = null, // NEW: Function to build payload dynamically
}) => {
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const resetState = () => {
    setLoading(false);
    setRemark("");
    setError("");
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow) {
      setError("No record selected for deletion");
      return;
    }

    // Validate remark if required
    if (enableRemark && requiredRemark && !remark.trim()) {
      setError("Remark is required for deletion");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Build payload based on provided method
      let payload;

      if (customPayload) {
        // Use custom payload if provided
        payload = customPayload;
      } else if (payloadBuilder) {
        // Use payload builder function if provided
        payload = payloadBuilder(selectedRow, remark);
      } else {
        // Default payload structure
        payload = {
          [payloadField]: selectedRow[payloadField],
          ...(enableRemark && { remark: remark.trim() }),
        };
      }

      const { error: apiError, response } = await apiCall(
        method,
        endpoint,
        payload
      );

      if (response) {
        onSuccess?.(response.data);
        showToast(response?.message || "deleted sucessfully ", "success");
        onFetchRef?.();
        handleClose();
        resetState();
      } else {
        const errorMessage = apiError?.message || "Failed to delete record";
        setError(errorMessage);
        onError?.(apiError);
      }
    } catch (err) {
      const errorMessage = err?.message || "An unexpected error occurred";
      setError(errorMessage);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    resetState();
    handleClose();
  };

  const isConfirmDisabled =
    loading || (enableRemark && requiredRemark && !remark.trim());

  return (
    <CommonModal
      open={open}
      onClose={handleModalClose}
      title={title}
      maxWidth="xs"
      footerButtons={[
        {
          text: cancelText,
          variant: "outlined",
          onClick: handleModalClose,
          disabled: loading,
        },
        {
          text: loading ? "Deleting..." : confirmText,
          variant: "contained",
          color: "error",
          onClick: handleConfirmDelete,
          disabled: isConfirmDisabled,
        },
      ]}
    >
      <Spinner loading={loading} />
      <Box sx={{ p: 2 }}>
        {/* Error Display */}
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Confirmation Message */}
        <Typography sx={{ mt: 1, mb: 2 }}>
          Are you sure you want to delete <b>"{selectedRow?.[field]}"</b>?
          {enableRemark && requiredRemark && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              * Remark is required for this action
            </Typography>
          )}
        </Typography>

        {/* Remark Input */}
        {enableRemark && (
          <TextField
            label="Remark"
            fullWidth
            value={remark}
            onChange={(e) => {
              setRemark(e.target.value);
              setError(""); // Clear error when user starts typing
            }}
            error={!!error && requiredRemark && !remark.trim()}
            helperText={
              requiredRemark && !remark.trim()
                ? "Remark is required"
                : "Optional note for this deletion"
            }
            disabled={loading}
          />
        )}
      </Box>
    </CommonModal>
  );
};

export default CommonDeleteModal;

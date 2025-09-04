import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";

const DeleteAccount = ({ open, handleClose, selectedAccount, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const { error, response } = await apiCall(
        "POST",
        `${ApiEndpoints.DELETE_ACCOUNT}/${selectedAccount.id}`
      );

      if (!error && response?.status === "SUCCESS") {
        onDeleted(selectedAccount.id); // ✅ update parent state
        handleClose();
      } else {
        console.error("Delete failed:", error || response);
      }
    } catch (err) {
      console.error("Error deleting account:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <CommonModal
      open={open}
      handleClose={handleClose}
      title="Delete Account"
      maxWidth="xs"
    >
      <Box sx={{ p: 2 }}>
        <Typography sx={{ mb: 3 }}>
          Are you sure you want to delete account{" "}
          <b>{selectedAccount?.name}</b>?
        </Typography>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </Box>
      </Box>
    </CommonModal>
  );
};

export default DeleteAccount;

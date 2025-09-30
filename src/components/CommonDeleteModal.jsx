import React, { useState } from "react";
import { Typography, Box, TextField } from "@mui/material";
import { apiCall } from "../api/apiClient";
import CommonModal from "./common/CommonModal";

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
}) => {
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState("");

  const handleConfirmDelete = async () => {
    if (!selectedRow) return;
    try {
      setLoading(true);
      const payload = {
        [payloadField]: selectedRow[payloadField],
        ...(enableRemark && { remark }), // include remark if enabled
      };
      const { error, response } = await apiCall("POST", endpoint, payload);

      if (response) {
        onFetchRef?.();
        handleClose();
      } else {
        console.error("Delete failed:", error || response);
      }
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title={title}
      maxWidth="xs"
      footerButtons={[
        {
          text: cancelText,
          variant: "outlined",
          onClick: handleClose,
        },
        {
          text: loading ? "Deleting..." : confirmText,
          variant: "contained",
          onClick: handleConfirmDelete,
          disabled: loading,
        },
      ]}
    >
      <Box sx={{ p: 2 }}>
        <Typography sx={{ mt: 1 }}>
          Are you sure you want to delete <b>{selectedRow?.[field]}</b>?
        </Typography>

        {enableRemark && (
          <TextField
            label="Remark "
            fullWidth
            sx={{ mt: 2 }}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        )}
      </Box>
    </CommonModal>
  );
};

export default CommonDeleteModal;

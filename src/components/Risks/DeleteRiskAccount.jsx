import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import { apiCall } from "../../api/apiClient";
import CommonModal from "../common/CommonModal"; // मान लिया कि ये आपका modal wrapper है
import { okSuccessToast } from "../../utils/ToastUtil";
import { useToast } from "../../utils/ToastContext";

const DeleteRiskAccount = ({
  open,
  handleClose,
  selectedRow,
  onFetchRef,
  endpoint, // 🔑 dynamic API endpoint
  title = "Delete Record",
  field = "acc_no", // 🔑 कौन सा field show करना है confirmation में
}) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const { error, response } = await apiCall("POST", endpoint, {
        id: selectedRow.id,
      });

      if (response) {
        okSuccessToast(response?.message);
        onFetchRef?.();
        handleClose();
      } else {
        showToast(error?.message);
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
          text: "Cancel",
          variant: "outlined",
          onClick: handleClose,
        },
        {
          text: loading ? "Deleting..." : "Confirm",
          variant: "contained",
          onClick: handleConfirmDelete,
          disabled: loading,
        },
      ]}
    >
      <Box sx={{ p: 2 }}>
        <Typography sx={{ mt: 3 }}>
          Are you sure you want to delete <b>{selectedRow?.[field]}</b>?
        </Typography>
      </Box>
    </CommonModal>
  );
};

export default DeleteRiskAccount;

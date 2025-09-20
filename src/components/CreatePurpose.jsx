import { useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import CommonModal from "./common/CommonModal";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { useToast } from "../utils/ToastContext";

const CreatePurpose = ({ open, onClose, onFetchRef }) => {
  const [form, setForm] = useState({
    type: "",
  });
  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.CREATE_PURPOSE,
      form
    );

    if (response) {
      showToast(response?.message || "Service created successfully", "success");
      onFetchRef();
      onClose();
    } else {
      showToast(error?.message || "Failed to create Service", "error");
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Create Purpose"
      iconType="info"
      footerButtons={[
        { text: "Cancel", variant: "outlined", onClick: onClose },
        { text: "Create", variant: "contained", onClick: handleCreate },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          fullWidth
        />
      </Box>
    </CommonModal>
  );
};

export default CreatePurpose;

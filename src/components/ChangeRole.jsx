import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

// Role labels for display
const roleLabels = {
  ret: "Retailer",
  adm: "Admin",
  sadm: "Super Admin",
  di: "Distributor",
  asm: "Area Sales Manager",
  zsm: "Zonal Sales Manager",
  api: "API User",
  dd: "Direct Dealer",
  md: "Master Distributor",
};

const ChangeRoleModal = ({ open, onClose, user, onSuccess }) => {
  const { showToast } = useToast();
  const [role, setRole] = useState(user?.role || "");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch roles dynamically when modal opens
  useEffect(() => {
    if (open) {
      setRole(user?.role || "");
    //   fetchRoles();
    }
  }, [open, user]);

//   const fetchRoles = async () => {
//     setLoadingRoles(true);
//     try {
//       const { response, error } = await apiCall("POST", ApiEndpoints.GET_USERROLES);
//       if (response?.data?.length > 0) {
//         setRoles(response.data); // expected: [{ role: "adm", role_name: "Admin" }, ...]
//       } else {
//         showToast("No roles found, using default roles", "info");
//         setRoles([]);
//       }
//     } catch (err) {
//       console.error("Error fetching roles:", err);
//       showToast("Failed to load roles", "error");
//     } finally {
//       setLoadingRoles(false);
//     }
//   };

  const handleSubmit = async () => {
    if (!role) {
      showToast("Please select a role", "error");
      return;
    }

    if (!user?.id) {
      showToast("User ID is missing", "error");
      return;
    }

    setLoading(true);
    try {
      const { response, error } = await apiCall("POST", ApiEndpoints.CHANGE_ROLE, {
        user_id: user.id, // ✅ backend expects user_id
        role,
      });

      if (response) {
        showToast(response.message || "Role updated successfully", "success");
        onSuccess?.();
        onClose();
      } else {
        showToast(error?.message || "Failed to change role", "error");
      }
    } catch (err) {
      console.error("API Error:", err);
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Change Role for {user?.name || "User"}
        </Typography>

        {loadingRoles ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={3}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <TextField
            select
            label="Select Role"
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
            margin="normal"
          >
            {roles.length > 0
              ? roles.map((r) => {
                  const value = r.role || r.code;
                  const label = roleLabels[value] || r.role_name || r.name || value;
                  return (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  );
                })
              : Object.entries(roleLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
          </TextField>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button onClick={onClose} variant="outlined" color="error" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Update Role"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChangeRoleModal;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
 
 
 
 
import { useToast } from "../utils/ToastContext";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast } from "../utils/ToastUtil";

const AdminCreateUser = ({ open, onClose, onFetchRef }) => {
  const { showToast } = useToast();
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [conditionalData, setConditionalData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loadingConditional, setLoadingConditional] = useState(false);
  const [schemaFields, setSchemaFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [loadingSchema, setLoadingSchema] = useState(false);

  const rolesList = [
    "sadm",
    "adm",
    "zsm",
    "asm",
    "md",
    "di",
    "ret",
    "dd",
    "api",
  ];

  const roleMapping = {
    ret: "di",
    di: "md",
    asm: "zsm",
    md: "asm",
  };

  useEffect(() => {
    setSchemaFields([]);
    setFormData({});
    setConditionalData([]);
    setSelectedUser("");

    const mappedRole = roleMapping[role];

    if (mappedRole) {
      const fetchConditionalUsers = async () => {
        try {
          setLoadingConditional(true);
          const { response, error } = await apiCall(
            "POST",
            ApiEndpoints.GET_USERS,
            { role: mappedRole }
          );
          if (response) {
            const users = response.data.data || [];
            if (users.length === 0) {
              fetchSchema();
              //   showToast("No data found for parent", "info");
            }
            setConditionalData(users);
          } else {
            showToast(error?.message || "Failed to fetch users", "error");
          }
        } catch (err) {
          console.error("Error fetching conditional users:", err);
          showToast("Something went wrong while fetching users", "error");
        } finally {
          setLoadingConditional(false);
        }
      };
      fetchConditionalUsers();
    } else if (role) {
      fetchSchema();
    }
  }, [role]);

  const fetchSchema = async (selectedUserId) => {
    try {
      setLoadingSchema(true);
      const params = selectedUserId ? { user_id: selectedUserId } : {};
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.GET_SIGNUP_SCHEMA,
        params
      );
      if (response) {
        setSchemaFields(response.data.fields || []);
        const initialData = {};
        (response.data.fields || []).forEach((f) => {
          initialData[f.name] = f.default || "";
        });
        setFormData(initialData);
      } else {
        showToast(error?.message || "Failed to fetch schema", "error");
      }
    } catch (err) {
      console.error("Error fetching schema:", err);
      showToast("Something went wrong while fetching schema", "error");
    } finally {
      setLoadingSchema(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchSchema(selectedUser);
    }
  }, [selectedUser]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!role) {
      showToast("Please select a role", "error");
      return;
    }

    const payload = { role, ...formData };
    if (selectedUser) payload.parent = selectedUser;

    setSubmitting(true);
    try {
      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_USER,
        payload
      );
      if (response) {
        okSuccessToast(response?.message || "User created successfully");
        onFetchRef?.();
        onClose();
      } else {
        showToast(error?.message || "Failed to create user", "error");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      showToast("Something went wrong while creating user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          Create New User
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
      >
        {/* Role Selection */}
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            {rolesList.map((r) => (
              <MenuItem key={r} value={r}>
                {r.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Conditional Parent User */}
        {conditionalData.length > 0 && (
          <FormControl
            fullWidth
            variant="outlined"
            size="small"
            disabled={loadingConditional}
          >
            <InputLabel>Parent User</InputLabel>
            <Select
              value={selectedUser}
              label="Parent User"
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {conditionalData.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name || u.username}
                </MenuItem>
              ))}
            </Select>
            {loadingConditional && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <CircularProgress size={20} />
              </Box>
            )}
          </FormControl>
        )}

        {/* Schema Fields */}
        {loadingSchema && <CircularProgress sx={{ alignSelf: "center" }} />}
        {!loadingSchema &&
          schemaFields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              type={field.type || "text"}
            />
          ))}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button onClick={onClose} disabled={submitting} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminCreateUser;

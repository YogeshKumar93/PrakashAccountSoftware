import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const ComplaintForm = ({ txnId, onSuccess }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "",
    text: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!txnId) {
      setSnackbar({
        open: true,
        type: "error",
        text: "Invalid transaction selected",
      });
      return;
    }
    if (!message.trim()) {
      setSnackbar({
        open: true,
        type: "error",
        text: "Complaint message is required",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/complains/create", {
        txn_id: txnId,
        message,
      });

      if (res.data.status === "success") {
        setSnackbar({
          open: true,
          type: "success",
          text: res.data.message || "Complaint created successfully",
        });
        setMessage("");
        if (onSuccess) onSuccess(res.data.data); // pass data back
      } else {
        setSnackbar({
          open: true,
          type: "error",
          text: res.data.message || "Something went wrong",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        text: err.response?.data?.message || "Server error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 450,
      }}
    >
      <Typography variant="h6">Raise a Complaint</Typography>

      {/* Transaction ID (auto-filled, readonly) */}
      <TextField
        label="Transaction ID"
        value={txnId || ""}
        InputProps={{ readOnly: true }}
        fullWidth
        variant="outlined"
      />

      {/* Complaint message */}
      <TextField
        label="Complaint Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        required
        multiline
        rows={3}
        placeholder="Enter your complaint details..."
      />

      {/* Submit button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Submit Complaint"}
      </Button>

      {/* Snackbar for user feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.type || "info"}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ComplaintForm;

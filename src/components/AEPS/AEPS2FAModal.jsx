/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
  CaptureFingerPrintAeps2,
  GetMFS100InfoLoad,
} from "../../utils/MantraCapture";
// import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DevicesIcon from "@mui/icons-material/Devices";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import { apiErrorToast } from "../../utils/ToastUtil";

const AEPS2FAModal = ({ open, onClose }) => {
  const [aadhaar, setAadhaar] = useState("");
  const [rdDeviceList, setRdDeviceList] = useState([]);
  const [rdDevice, setRdDevice] = useState(null);
  const [status, setStatus] = useState("NOT READY");
  const [scanQuality, setScanQuality] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast } = useToast();
  // Detect devices when modal opens

  useEffect(() => {
    if (open) {
      detectDevice();
    }
  }, [open]);
  const detectDevice = () => {
    setLoading(true);
    setError("");
    setRdDeviceList([]);
    setRdDevice(null);
    setStatus("DETECTING...");

    GetMFS100InfoLoad(
      setLoading,
      (devices) => {
        setLoading(false);
        if (devices && devices.length > 0) {
          setRdDeviceList(devices);

          // Auto-select the first READY device if available
          const readyDevice = devices.find((d) => d.status === "READY");
          if (readyDevice) {
            setRdDevice(readyDevice);
            setStatus(readyDevice.status);
          } else {
            setStatus("NOT READY");
          }
        } else {
          setError("No fingerprint devices detected");
          setStatus("NOT READY");
        }
      },
      (error) => {
        setLoading(false);
        setError("Failed to detect devices: " + error);
        setStatus("NOT READY");
      }
    );
  };

  const startScan = () => {
    if (!rdDevice) {
      setError("Please select a device first");
      return;
    }

    if (!aadhaar || aadhaar.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setStatus("SCANNING...");

    CaptureFingerPrintAeps2(
      rdDevice.rdport,
      (qualityMessage, data) => {
        setLoading(false);
        setStatus("CONNECTED");
        setScanQuality(data.qScore);
        setSuccess(`Fingerprint captured successfully! ${qualityMessage}`);

        // Here you would typically send the captured data to your backend
        console.log("Fingerprint data:", data);
      },
      (error) => {
        setLoading(false);
        setStatus("ERROR");
        setError("Scan failed: " + error);
      }
    );
  };

  // Status color logic
  const getStatusColor = () => {
    if (status === "CONNECTED") return "#4caf50";
    if (status === "SCANNING...") return "#ff9800";
    if (status === "READY") return "#2196f3";
    if (status === "DETECTING...") return "#9d72f0";
    if (status === "ERROR") return "#f44336";
    return "#9e9e9e";
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        fontFamily: '"DM Sans", sans-serif',
        maxWidth: 800,
        mx: "auto",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f5ff 100%)",
        boxShadow: "0 8px 24px rgba(157, 114, 240, 0.15)",
        border: "1px solid rgba(157, 114, 240, 0.1)",
        position: "relative",
      }}
    >
      {/* Header with gradient */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #9d72f0 0%, #7b4dff 100%)",
          color: "white",
          p: 2.5,
          borderRadius: "10px 10px 0 0",
          mx: -3,
          mt: -3,
          mb: 3,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "white",
            opacity: 0.8,
            transition: "opacity 0.2s",
            "&:hover": {
              opacity: 1,
              background: "rgba(255,255,255,0.1)",
            },
            p: 0.5,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontWeight: "700",
            letterSpacing: "0.3px",
            fontSize: "1.25rem",
          }}
        >
          AEPS 2 Factor Authentication
        </Typography>

        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            opacity: 0.9,
            mt: 0.5,
            fontWeight: "500",
            fontSize: "0.85rem",
          }}
        >
          Secure biometric verification
        </Typography>
      </Box>

      {/* Buttons at top */}
      <Stack
        direction="row"
        spacing={1.5}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Button
          variant="contained"
          sx={{
            bgcolor: "white",
            color: "#9d72f0",
            "&:hover": {
              bgcolor: "#f5f2ff",
              boxShadow: "0 4px 12px rgba(157, 114, 240, 0.25)",
            },
            borderRadius: "10px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: "600",
            fontSize: "0.9rem",
            boxShadow: "0 3px 8px rgba(157, 114, 240, 0.15)",
            transition: "all 0.2s ease",
            minWidth: "auto",
          }}
        >
          AEPS1
        </Button>

        <Button
          variant="contained"
          sx={{
            bgcolor: "#9d72f0",
            "&:hover": {
              bgcolor: "#8c61e6",
              boxShadow: "0 4px 12px rgba(157, 114, 240, 0.35)",
            },
            borderRadius: "10px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: "600",
            fontSize: "0.9rem",
            boxShadow: "0 3px 8px rgba(157, 114, 240, 0.25)",
            transition: "all 0.2s ease",
            minWidth: "auto",
          }}
        >
          AEPS2
        </Button>
      </Stack>

      {/* Error/Success Alerts */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 1.5,
            fontFamily: '"DM Sans", sans-serif',
            alignItems: "center",
            py: 0.5,
            fontSize: "0.85rem",
          }}
          icon={<ErrorOutlineIcon fontSize="small" />}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: 1.5,
            fontFamily: '"DM Sans", sans-serif',
            alignItems: "center",
            py: 0.5,
            fontSize: "0.85rem",
          }}
          icon={<CheckCircleOutlineIcon fontSize="small" />}
        >
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Side Status Bar */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 240,
              bgcolor: "#faf8ff",
              borderRadius: 2,
              p: 2,
              boxShadow: "0 4px 12px rgba(157, 114, 240, 0.08)",
              border: "1px solid rgba(157, 114, 240, 0.08)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                mb: 1.5,
                color: "#5a4b81",
                fontWeight: "600",
                fontSize: "0.95rem",
              }}
            >
              Device Status
            </Typography>

            <Box
              sx={{
                width: "100%",
                height: 160,
                bgcolor: "#f5f2ff",
                borderRadius: 1.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 1.5,
                position: "relative",
                border: "1px dashed rgba(157, 114, 240, 0.2)",
              }}
            >
              {loading && (
                <CircularProgress
                  size={28}
                  thickness={4}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-14px",
                    marginLeft: "-14px",
                    color: "#9d72f0",
                  }}
                />
              )}
              <Box
                sx={{
                  width: 20,
                  height: 80,
                  bgcolor: getStatusColor(),
                  borderRadius: 1.5,
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.5 : 1,
                  boxShadow: `0 0 8px ${getStatusColor()}40`,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  mt: 1.5,
                  fontWeight: "700",
                  color: getStatusColor(),
                  textAlign: "center",
                  fontSize: "0.95rem",
                }}
              >
                {status}
              </Typography>

              {scanQuality && (
                <Chip
                  label={`Quality: ${scanQuality}`}
                  sx={{
                    mt: 1.5,
                    bgcolor: "#9d72f0",
                    color: "white",
                    fontWeight: "500",
                    height: 24,
                    fontSize: "0.75rem",
                  }}
                  size="small"
                />
              )}
            </Box>
          </Box>
        </Grid>

        {/* Right Side Form */}
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              bgcolor: "#faf8ff",
              borderRadius: 2,
              p: 2.5,
              boxShadow: "0 4px 12px rgba(157, 114, 240, 0.08)",
              border: "1px solid rgba(157, 114, 240, 0.08)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                color: "#5a4b81",
                fontWeight: "600",
                fontSize: "0.95rem",
              }}
            >
              Authentication Details
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Aadhaar Number"
                value={aadhaar}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 12) setAadhaar(val);
                }}
                size="small"
                fullWidth
                error={aadhaar.length > 0 && aadhaar.length !== 12}
                helperText={
                  aadhaar.length > 0 && aadhaar.length !== 12
                    ? "Aadhaar must be 12 digits"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "0.9rem",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "0.75rem",
                    mx: 0,
                    mt: 0.5,
                  },
                }}
                inputProps={{
                  maxLength: 12,
                  style: { fontFamily: '"DM Sans", sans-serif' },
                }}
              />

              <TextField
                select
                SelectProps={{ native: true }}
                label="Select RD Device"
                value={rdDevice ? rdDevice.info : ""}
                onChange={(e) => {
                  const selectedDevice = rdDeviceList.find(
                    (d) => d.info === e.target.value
                  );
                  setRdDevice(selectedDevice);
                  setStatus(
                    selectedDevice ? selectedDevice.status : "NOT READY"
                  );
                }}
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "0.9rem",
                  },
                }}
              >
                <option value="">-- Select Device --</option>
                {rdDeviceList.map((d, i) => (
                  <option key={i} value={d.info}>
                    {d.info} ({d.status})
                  </option>
                ))}
              </TextField>

              <TextField
                label="Device Info"
                value={rdDevice ? rdDevice.info : ""}
                size="small"
                InputProps={{ readOnly: true }}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    fontFamily: '"DM Sans", sans-serif',
                    bgcolor: "#f5f2ff",
                    fontSize: "0.9rem",
                  },
                }}
              />

              <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={detectDevice}
                  disabled={loading}
                  startIcon={<SearchIcon sx={{ fontSize: "18px" }} />}
                  sx={{
                    borderRadius: 1.5,
                    py: 0.75,
                    textTransform: "none",
                    fontWeight: "600",
                    color: "#9d72f0",
                    borderColor: "#9d72f0",
                    "&:hover": {
                      borderColor: "#8c61e6",
                      bgcolor: "#f5f2ff",
                    },
                    flex: 1,
                    fontSize: "0.85rem",
                  }}
                >
                  Detect
                </Button>
                <Button
                  variant="contained"
                  onClick={startScan}
                  disabled={
                    !rdDevice || !aadhaar || aadhaar.length !== 12 || loading
                  }
                  startIcon={<FingerprintIcon sx={{ fontSize: "18px" }} />}
                  sx={{
                    borderRadius: 1.5,
                    py: 0.75,
                    textTransform: "none",
                    fontWeight: "600",
                    bgcolor: "#9d72f0",
                    "&:hover": {
                      bgcolor: "#8c61e6",
                      boxShadow: "0 4px 12px rgba(157, 114, 240, 0.35)",
                    },
                    flex: 2,
                    boxShadow: "0 3px 8px rgba(157, 114, 240, 0.25)",
                    fontSize: "0.85rem",
                  }}
                >
                  Start Scan
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* Note at bottom */}
      <Typography
        variant="caption"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 2.5,
          color: "text.secondary",
          px: 1,
          fontFamily: '"DM Sans", sans-serif',
          fontSize: "0.75rem",
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: "14px", mr: 0.5 }} />
        Connect scanner for scanning. Status turns{" "}
        <Box
          component="span"
          sx={{ color: "#4caf50", fontWeight: "bold", mx: 0.5 }}
        >
          green
        </Box>
        when connected,{" "}
        <Box
          component="span"
          sx={{ color: "#f44336", fontWeight: "bold", mx: 0.5 }}
        >
          red
        </Box>{" "}
        when not.
      </Typography>
    </Box>
  );
};

export default AEPS2FAModal;

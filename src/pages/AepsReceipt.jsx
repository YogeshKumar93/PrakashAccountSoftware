import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Divider,
} from "@mui/material";

const AepsReceipt = () => {
  const details = [
    { label: "Transaction Date:", value: "2025-10-26 13:40:01" },
    { label: "Aadhaar:", value: "XXXXXXXX8043" },
    { label: "Bank Name:", value: "Indian Bank" },
    { label: "RRN:", value: "529913463022" },
    { label: "Customer No.:", value: "9879876465" },
    { label: "Available Balance:", value: "136128.15" },
    { label: "Txn Amount:", value: "10000" },
    // { label: "Auth Code:", value: "339426" },
    { label: "Terminal Id:", value: "--" },
    { label: "Service Type:", value: "AEPS_CASHOUT" },
    // { label: "Location:", value: "--" },
    // { label: "Agent Id:", value: "511234" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          bgcolor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
          p: 3,
          textAlign: "center",
        }}
      >
        {/* Header */}
        <Box
          component="img"
          src="src/assets/Images/PPALogor.png"
          alt="Transup Logo"
          sx={{
            height: 40,
            objectFit: "contain",
          }}
        />

        <Typography variant="body2" sx={{ m: 2 }}>
          PSPKA SERVICES PRIVATE LIMITED
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
         PVT No.-2, B-1, KH No.900/289 Ground Floor, Shalimar Village,
         District: North-West, Delhi-110088 
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Email: Support@p2pae.com
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Transaction Info */}
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ borderColor: "#ccc" }}
        >
          <Table size="small">
            <TableBody>
              {details.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#000",
                      width: "50%",
                      borderColor: "#ccc",
                    }}
                  >
                    {item.label}:
                  </TableCell>
                  <TableCell sx={{ color: "#333", borderColor: "#ccc" }}>
                    {item.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider sx={{ my: 2 }} />

        {/* Status */}
        <Typography variant="h6" sx={{ color: "green", fontWeight: "bold" }}>
          SUCCESS  APPROVED
        </Typography>
        

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Don’t pay any charges for this transaction
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          {/* Left Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#673ab7",
                "&:hover": { backgroundColor: "#5e35b1" },
                textTransform: "none",
                px: 4,
              }}
            >
              Close
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
                textTransform: "none",
                px: 4,
              }}
              onClick={()=>window.print()}
            >
              Print
            </Button>
          </Box>

          {/* Right Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
              textTransform: "none",
              px: 4,
            }}
          >
            Mini Statement
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AepsReceipt;

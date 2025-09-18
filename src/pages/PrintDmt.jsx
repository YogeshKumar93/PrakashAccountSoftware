import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { ddmmyyWithTime } from "../utils/DateUtils";
import biggpayLogo from "../assets/logo(1).png";

const PrintDmt = () => {
  const [receiptType, setReceiptType] = useState("large");
  const location = useLocation();

  // ✅ Transaction data passed from previous page (via navigate)
  const data = location.state?.txnData;

  if (!data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error" variant="h6">
          No Transaction Data Available
        </Typography>
      </Box>
    );
  }

  const headers = [
    "Date",
    "UTR",
    "Operator",
    "Sender",
    "Ben Name",
    "Account No",
    "IFSC Code",
    "Amount",
    "Status",
  ];

  const values = [
    ddmmyyWithTime(data.created_at),
    data.txn_id,
    data.operator,
    data.sender_mobile,
    data.beneficiary_name,
    data.account_number,
    data.ifsc_code,
    `₹ ${data.amount}`,
    data.status,
  ];

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
        .table-container table {
          width: auto;
          height: auto;
          border: 1px solid blue;
          border-collapse: collapse;
        }
        .table-row {
          display: table-row;
        }
        .table-cell {
          display: table-cell;
          border: 1px solid #e0e0e0;
          padding: 8px;
          text-align: center;
          vertical-align: middle;
          word-break: break-word;
        }
        .header-cell {
          font-weight: 600;
          background: #f9fafb;
        }
        .amount {
          font-weight: 700;
          color: #d32f2f;
        }
        .status-success {
          font-weight: 700;
          color: green;
        }
        .status-failed {
          font-weight: 700;
          color: red;
        }
      `}</style>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 2,
          pt: 4,
        }}
      >
        {/* Toggle Receipt Type */}
        <Box display="flex" justifyContent="center" mb={2} className="no-print">
          <RadioGroup
            row
            value={receiptType}
            onChange={(e) => setReceiptType(e.target.value)}
          >
            <FormControlLabel
              value="large"
              control={<Radio />}
              label="Large Receipt"
            />
            <FormControlLabel
              value="small"
              control={<Radio />}
              label="Small Receipt"
            />
          </RadioGroup>
        </Box>

        {/* Receipt Container */}
        <Box
          className="receipt-container"
          sx={{
            width: "100%",
            maxWidth: receiptType === "large" ? 1200 : 400,
            border: "2px solid #d6e4ed",
            borderRadius: 2,
            background: "#fff",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            p: { xs: 2, md: 2 },
            fontFamily: "Roboto, sans-serif",
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom="2px solid #e0e0e0"
          >
            <Box
              sx={{
                width: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={biggpayLogo}
                alt="IMPS GURU Logo"
                sx={{
                  width: 120,
                  height: 60,
                  objectFit: "contain",
                }}
              />
            </Box>

            <Box textAlign="right">
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {data.company || "Company Name"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.companyNumber}
              </Typography>
            </Box>
          </Box>

          {/* Transaction Summary Button only for large receipt */}
          {receiptType === "large" && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  border: "2px solid #2b9bd7",
                  color: "#2b9bd7",
                  fontWeight: "bold",
                  background: "#fff",
                  "&:hover": {
                    background: "rgba(43, 155, 215, 0.1)",
                    border: "2px solid #2386ba",
                    color: "#2386ba",
                  },
                }}
              >
                Transaction Summary
              </Button>
            </Box>
          )}

          {/* Receipt Content */}
          {receiptType === "large" ? (
            <>
              <Box className="table-container" mt={3}>
                <Box className="table-row">
                  {headers.map((header, i) => (
                    <Box key={i} className="table-cell header-cell">
                      {header}
                    </Box>
                  ))}
                </Box>
                <Box className="table-row">
                  {values.map((value, i) => {
                    if (i === 7) {
                      return (
                        <Box key={i} className="table-cell amount">
                          {value}
                        </Box>
                      );
                    }
                    if (i === 8) {
                      return (
                        <Box
                          key={i}
                          className={`table-cell ${
                            data.status?.toLowerCase() === "success"
                              ? "status-success"
                              : "status-failed"
                          }`}
                        >
                          {value}
                        </Box>
                      );
                    }
                    return (
                      <Box key={i} className="table-cell">
                        {value}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box
                mt={2}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {[
                  { label: "Date", value: ddmmyyWithTime(data.created_at) },
                  { label: "Txn ID", value: data.txn_id },
                  { label: "Beneficiary", value: data.beneficiary_name },
                  { label: "Account No", value: data.account_number },
                  { label: "Amount", value: `₹ ${data.amount}`, type: "amount" },
                  { label: "Status", value: data.status, type: "status" },
                ].map((item, i) => (
                  <Box
                    key={i}
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      p: 2,
                      borderBottom: i !== 5 ? "1px solid #f0f0f0" : "none",
                      bgcolor: i % 2 === 0 ? "#fafafa" : "transparent",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.label}:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: item.type ? "bold" : "normal",
                        color:
                          item.type === "amount"
                            ? "#d32f2f"
                            : item.type === "status" &&
                              data.status?.toLowerCase() === "success"
                            ? "green"
                            : item.type === "status"
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* Footer */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={3}
          >
            <Typography variant="caption" color="text.secondary">
              © 2024 All Rights Reserved
            </Typography>
            <Button
              variant="contained"
              className="no-print"
              onClick={() => window.print()}
              sx={{
                borderRadius: 2,
                background: "#2b9bd7",
                textTransform: "none",
             px:4,
                "&:hover": { background: "#ff9a3c" },
              }}
            >
              Print
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PrintDmt;

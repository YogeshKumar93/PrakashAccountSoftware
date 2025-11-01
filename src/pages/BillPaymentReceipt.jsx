import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const BillPaymentReceipt = ({
  receiptData,
  onClose,
  billerDetails,
  inputValues,
}) => {
  console.log("Receipt Data:", receiptData);

  const { data = {} } = receiptData || {};

  const {
    status: txnStatus,
    response,
    operator_id,
    indicore_ref,
    amount,
    billnumber,
    Txnmessage, // ✅ pick it here
  } = data;
  console.log("data", data);

  // ✅ Determine final values to display
  const transactionStatus = txnStatus || "N/A";
  const orderId = indicore_ref || "-";
  const finalOperator = receiptData?.operator_id || "Unknown Operator";
  const finalAmount =
    amount ||
    inputValues?.amount || // fallback if amount was entered manually
    "-";
  const billerNumber = billnumber || "-";
  const transactionMessage =
    Txnmessage || receiptData?.message || response || "Transaction Completed";
  console.log("transactionmessage", transactionMessage);

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // ✅ Handlers
  const handleDownload = () => {
    console.log("Downloading receipt...");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box
      sx={{
        maxWidth: "500px",
        margin: "auto",
        p: 3,
        backgroundColor: "white",
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* ✅ Header */}
          <Box textAlign="center" mb={3}>
            <CheckCircleIcon
              sx={{
                fontSize: 64,
                color:
                  transactionStatus?.toLowerCase() === "pending"
                    ? "warning.main"
                    : transactionStatus?.toLowerCase() === "failed"
                    ? "error.main"
                    : "success.main",
                mb: 2,
              }}
            />
            <Typography
              variant="body1"
              color="text.secondary"
              fontWeight="bold"
            >
              {transactionMessage || response || "Transaction Completed"}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ✅ Transaction Details */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#6C4BC7" }}
            >
              Transaction Details
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Amount */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                }}
              >
                <Typography fontWeight="bold">Amount Paid</Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  ₹{finalAmount}
                </Typography>
              </Box>

              {/* <DetailRow label="Order ID" value={orderId} /> */}
              <DetailRow label="Operator ID" value={finalOperator} />
              <DetailRow label="Bill Number" value={billerNumber} />

              {billerDetails && (
                <DetailRow
                  label="Biller Name"
                  value={billerDetails?.billerInfo?.name}
                />
              )}

              <DetailRow label="Date" value={currentDate} />
              <DetailRow label="Time" value={currentTime} />

              {/* Show any additional dynamic inputs */}
              {inputValues &&
                Object.entries(inputValues).map(([key, value]) => (
                  <DetailRow
                    key={key}
                    label={key.replace(/([A-Z])/g, " $1").toUpperCase()}
                    value={value}
                  />
                ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ✅ Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <IconButton
              onClick={handleDownload}
              sx={{
                backgroundColor: "#f0f0f0",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <DownloadIcon />
            </IconButton>

            <IconButton
              onClick={handlePrint}
              sx={{
                backgroundColor: "#f0f0f0",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <PrintIcon />
            </IconButton>
          </Box>

          {/* ✅ Done Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
            sx={{
              mt: 3,
              borderRadius: 2,
              py: 1.5,
              fontWeight: "bold",
              backgroundColor: "#6C4BC7",
              "&:hover": {
                backgroundColor: "#5a3cb0",
              },
            }}
          >
            Done
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

// 🔹 Reusable Row Component
const DetailRow = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight="medium">
      {value || "-"}
    </Typography>
  </Box>
);

export default BillPaymentReceipt;

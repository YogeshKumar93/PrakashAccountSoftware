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
  const { status, message, data = {} } = receiptData || {};

  // Handle both response formats
  const {
    transactionId,
    amount,
    operator,
    data: nestedData = {},
    status: innerStatus,
    response,
    operator_id,
    indicore_ref,
  } = data || {};

  // 🧠 Try to extract details safely for both response types
  let parsedResponse = {};
  if (typeof response === "string" && response.includes("|")) {
    const parts = response.split("|");
    parsedResponse = {
      code: parts[0],
      msg: parts[1],
      orderId: parts[2],
      unknown1: parts[3],
      refId: parts[4],
    };
  }

  const transactionStatus =
    innerStatus || data?.status || parsedResponse?.msg || "N/A";
  const order_id =
    nestedData?.order_id || parsedResponse?.orderId || indicore_ref || "-";
  const finalAmount = amount || nestedData?.amount || "-";
  const finalOperator = operator || operator_id || "Unknown Operator";
  const customerNumber =
    nestedData?.param1 || nestedData?.customerNumber || "-";

  // Format date and time
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

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
          {/* Header */}
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
              {message ||
                `Transaction ${transactionStatus?.toLowerCase()} successfully`}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Transaction Details */}
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

              <DetailRow label="Order ID" value={order_id} />
              <DetailRow label="Operator" value={finalOperator} />
              <DetailRow label="Customer Number" value={customerNumber} />
              <DetailRow label="Status" value={transactionStatus} />

              {billerDetails && (
                <DetailRow
                  label="Biller"
                  value={billerDetails?.billerInfo?.name}
                />
              )}

              <DetailRow label="Date" value={currentDate} />
              <DetailRow label="Time" value={currentTime} />

              {/* Additional dynamic inputs */}
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

          {/* Action Buttons */}
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

          {/* Close Button */}
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

// 🔹 Reusable DetailRow Component
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

import React from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PanToolIcon from "@mui/icons-material/PanTool"; // This is the hand icon

// Status color mapping
const statusColors = {
  Success: "#0d7425ff",
  Failed: "#a42f39ff",
  Pending: "#e4bb32ff",
};

const handleDownload = async () => {
    try {
       
      const response = await fetch("/sample.pdf");
      if (!response.ok) throw new Error("File not found");

      // 2. Convert to blob
      const blob = await response.blob();

      // 3. Create object URL
      const url = window.URL.createObjectURL(blob);

      // 4. Create a temporary <a> element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample.pdf"); // File name
      document.body.appendChild(link);

      // 5. Trigger click & cleanup
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

const TransactionDetailsCard = ({
  amount,
  status,
  dateTime,
  message,
  details = [],
  onRaiseIssue,
  onClose,        
  companyLogoUrl, 
  width = 400,
  
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width,
        height: "90%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
           position: "absolute", // <-- important
    zIndex: 900,
     top: 64, // <-- add this! (replace 64 with your header height)
    left: "50%",
    transform: "translateX(-50%)",
     
      }}
    >
      {/* Header */}
      <Box
        sx={{
        
          bgcolor: statusColors[status] || "#f5f5f5",
          display: "flex",
          flexDirection: "column",
           position: "sticky", 
          top: 0,             
          zIndex: 10,  
          height:180
             
        }}
      >
        {/* Top Row: Close + Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          {/* Close icon on left */}
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>

          {/* Company Logo on right */}
          {companyLogoUrl && (
            <Box
              component="img"
              src={companyLogoUrl}
              alt="Company Logo"
              sx={{ height: 72, width: 122, objectFit: "contain" }}
            />
          )}
        </Box>

        {/* Amount / Status / Date */}
        {amount && (
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            ₹ {amount}
          </Typography>
        )}
        {status && (
          <Typography
            variant="h6"
            textAlign="center"
            color={status === "Success" ? "success.main" : "error"}
          >
            {status}
          </Typography>
        )}
        {dateTime && (
          <Typography variant="caption" textAlign="center">
            {dateTime}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Message */}
      {message && (
        <Box p={2}>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </Box>
      )}

      <Divider />

    
     {/* Details in rows */}
{details.length > 0 && (
<Box p={2} flex={1} overflow="auto">
  {/* Header Row with Icons */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    }}
  >
    <Typography variant="subtitle1">
      Transaction Details
    </Typography>
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton size="small" onClick={onRaiseIssue}>
        <PanToolIcon fontSize="small" />
      </IconButton>
  <IconButton size="small" onClick={handleDownload}>
      <DownloadIcon fontSize="small" />
    </IconButton>


    </Box>
  </Box>

  {/* Details List */}
  {details.map((item, idx) => (
    <Box
      key={idx}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: 1,
        borderBottom: "1px solid #eee",
        
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {item.label}
      </Typography>
      <Typography variant="body2" fontWeight="500">
        {item.value ?? "N/A"}
      </Typography>
    </Box>
  ))}
</Box>
)}


   
    </Paper>
  );
};

export default TransactionDetailsCard;

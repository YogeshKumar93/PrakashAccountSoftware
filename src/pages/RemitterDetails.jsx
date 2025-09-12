import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const RemitterDetails = ({ sender }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);

  const handleToggle = () => setOpen((prev) => !prev);

  return (
   <Card 
      sx={{ 
        borderRadius: 2,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >      {/* Header */}
      <Box
        sx={{
          bgcolor: "#0078B6",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
       py: 1,
          px: 2,
            cursor: isMobile ? "pointer" : "default",
        }}
        onClick={isMobile ? handleToggle : undefined}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Remitter Details
        </Typography>
        {isMobile && (
          <IconButton size="small" sx={{ color: "white" }}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>

      {/* Content with collapse on mobile */}
      <Collapse in={open || !isMobile} timeout="auto" unmountOnExit>
        {sender ? (
          <Box sx={{ mx: 2, my: 2, p: 1, bgcolor: "#f0f8ff", borderRadius: 2 }}>
            {[
              { label: "Name", value: `${sender.firstName} ${sender.lastName}` },
              { label: "Mobile Number", value: sender.mobileNumber },
              { label: "Pincode", value: sender.pincode || "-" },
              { label: "Available Limit", value: sender.limitAvailable },
            ].map((item, index) => (
              <Box key={index} display="flex" mb={1}>
                <Typography
                  variant="body2"
                  fontWeight="500"
                  color="#4B5563"
                  sx={{ width: "190px", flexShrink: 0 }}
                >
                  {item.label}
                </Typography>
                <Typography variant="body2" color="#111827">
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight={120}
          >
            <Typography variant="body2" color="text.secondary">
              Enter Mobile Number to view remitter details
            </Typography>
          </Box>
        )}
      </Collapse>
    </Card>
  );
};

export default RemitterDetails;

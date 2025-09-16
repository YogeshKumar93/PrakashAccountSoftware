import React from "react";
import { Button } from "@mui/material";

const CommonStatus = ({ value, is_read }) => {
  let statusText = "";

  // Handle main status
  if (value === 1 || value === "1") statusText = "ACTIVE";
  else if (value === 0 || value === "0") statusText = "INACTIVE";
  else statusText = value?.toString()?.toUpperCase();

  // Status-to-color mapping
  const statusColors = {
    ACTIVE: "green",
    INACTIVE: "gray",
    SUCCESS: "green",
    PENDING: "orange",
    APPROVED: "green",
    FAILED: "red",
    REJECTED: "orange",
  };

  let bgColor = statusColors[statusText] || "lightgray";

  // Override with is_read
  if (typeof is_read !== "undefined") {
    if (is_read === 0 || is_read === "0") {
      statusText = "UNREAD";
      bgColor = "#ff9800"; // Vibrant Orange
    } else if (is_read === 1 || is_read === "1") {
      statusText = "READ";
      bgColor = "#fdd835"; // Bright Yellow
    }
  }

  return (
    <Button
      sx={{
        backgroundColor: bgColor,
        color: "white",
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: "12px",
        minWidth: "80px", // ✅ keeps consistent width
        maxWidth: "80px", // ✅ prevents expanding
        padding: "4px 8px",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
      size="small"
    >
      {statusText}
    </Button>
  );
};

export default CommonStatus;

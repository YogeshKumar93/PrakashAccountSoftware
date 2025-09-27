// components/ReceiptButton.js
import React, { useState } from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import CommonModal from "./common/CommonModal";

const ReceiptButton = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1); // scale factor for zoom

  const handleOpen = () => {
    setZoom(1); // reset zoom on open
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3)); // max 3x zoom
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5)); // min 0.5x zoom

  return (
    <>
      <Tooltip title="View Receipt">
        <IconButton color="primary" onClick={handleOpen}>
          <ReceiptIcon />
        </IconButton>
      </Tooltip>

      <CommonModal
        open={open}
        onClose={handleClose}
        footerButtons={[]}
        title="Receipt"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* Receipt Image */}
          <img
            src={row?.receipt}
            alt="Receipt"
            style={{
              transform: `scale(${zoom})`,
              transition: "transform 0.3s ease",
              maxWidth: "40%",
              maxHeight: "50vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />

          {/* Zoom Controls */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut} color="primary">
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn} color="primary">
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CommonModal>
    </>
  );
};

export default ReceiptButton;

// components/common/ExportExcelButton.js
import React from "react";
import { IconButton, Tooltip, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useExcelExport } from "../../hooks/useExcelExport";

const ExportExcelButton = ({
  endpoint,
  appliedFilters = {},
  fileName = "Data",
  variant = "icon",
  size = "medium",
  color = "primary",
  disabled = false,
  tooltipTitle = "Export to Excel",
  onExportComplete,
  onExportStart,
}) => {
  const { handleExportExcel } = useExcelExport();

  const handleExport = async () => {
    if (onExportStart) {
      onExportStart();
    }

    console.log("Exporting with filters:", appliedFilters); // Debug log

    const result = await handleExportExcel(endpoint, appliedFilters, fileName);

    if (onExportComplete) {
      onExportComplete(result);
    }
  };

  if (variant === "button") {
    return (
      <Tooltip title={tooltipTitle}>
        <Button
          variant="contained"
          size={size}
          color={color}
          onClick={handleExport}
          disabled={disabled}
          startIcon={<FileDownloadIcon />}
        >
          Export Excel
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton
        color={color}
        onClick={handleExport}
        disabled={disabled}
        size={size}
      >
        <FileDownloadIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ExportExcelButton;

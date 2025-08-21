import React from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from "@mui/material";
export const ReButton = ({
  lable,
  onClick,
  type = "button",
  variant = "contained",
  size = "medium",
  fullWidth = false,
  disabled = false,
  startIcon,
  endIcon,
  color = "primary",
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      color={color}
      {...props}
    >
      {lable}
    </Button>
  );
};
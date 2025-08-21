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


export const ReTextField = ({
  label,
  value,
  onChange,
  name,
  placeholder,
  helperText,
  error,
  required,
  size = "small",
  fullWidth = true,
  type = "text",
  disabled = false,
  variant = "outlined",
  ...props
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      helperText={helperText}
      error={Boolean(error)}
      required={required}
      size={size}
      fullWidth={fullWidth}
      type={type}
      disabled={disabled}
      variant={variant}
      {...props}
    />
  );
};

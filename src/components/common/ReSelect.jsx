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
export const ReSelect = ({
  label,
  value,
  onChange,
  name,
  options = [],
  helperText,
  error,
  required,
  size = "small",
  fullWidth = true,
  disabled = false,
  variant = "outlined",
  ...props
}) => {
  const labelId = `${name || label}-label`;

  return (
    <FormControl fullWidth={fullWidth} size={size} disabled={disabled} error={Boolean(error)}>
      <InputLabel id={labelId} required={required}>
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={`${name || label}-select`}
        value={value}
        label={label}
        onChange={onChange}
        name={name}
        variant={variant}
        {...props}
      >
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};
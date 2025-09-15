import React, { useState, useEffect } from "react";
import { Box, MenuItem, Typography } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { ReTextField } from "./ReTextField";
import { apiCall } from "../../api/apiClient";

const CommonFormField = ({ field, formData, handleChange, errors, loading }) => {
  const { name, label, type, options = [], apiOptions, props = {} } = field;
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  useEffect(() => {
    if (!apiOptions) return;

    const fetchOptions = async () => {
      try {
        setOptionsLoading(true);
        const res = await apiCall(apiOptions.method || "post", apiOptions.endpoint);
        const rawData = res?.response?.data || res?.data || [];
        const mapped = apiOptions.mapOptions ? apiOptions.mapOptions(rawData) : rawData;
        setDynamicOptions(mapped);
      } catch (err) {
        console.error(`Error fetching options for ${name}:`, err);
        setDynamicOptions([]);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, [apiOptions, name]);

  const finalOptions = dynamicOptions.length ? dynamicOptions : options;

  const getErrorProps = () => ({
    error: !!errors[name],
    helperText: errors[name],
  });

  switch (type) {
    case "datepicker":
      return (
        <DatePicker
          label={label}
          value={formData[name] ? dayjs(formData[name]) : null}
          onChange={(newValue) =>
            handleChange({ target: { name, value: newValue ? dayjs(newValue).format("YYYY-MM-DD") : "" } })
          }
          slotProps={{ textField: { fullWidth: true, ...getErrorProps() } }}
          disabled={loading}
          {...props}
        />
      );

    case "timepicker":
      return (
        <TimePicker
          label={label}
          value={formData[name] ? dayjs(formData[name]) : null}
          onChange={(newValue) => handleChange({ target: { name, value: newValue?.toISOString() } })}
          slotProps={{ textField: { fullWidth: true, ...getErrorProps() } }}
          disabled={loading}
          {...props}
        />
      );

    case "select":
    case "dropdown":
      return (
        <ReTextField
          select
          fullWidth
          label={label}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          disabled={loading || optionsLoading}
          {...getErrorProps()}
        >
          {optionsLoading ? (
            <MenuItem disabled>Loading options...</MenuItem>
          ) : finalOptions.length ? (
            finalOptions.map((opt, i) => {
              if (typeof opt === "string") return <MenuItem key={i} value={opt}>{opt}</MenuItem>;
              const value = opt.value ?? opt.id ?? opt.bank_id ?? i;
              const labelText = opt.label ?? opt.bank_name ?? opt.name ?? String(value);
              return <MenuItem key={value} value={value}>{labelText}</MenuItem>;
            })
          ) : (
            <MenuItem disabled>No options available</MenuItem>
          )}
        </ReTextField>
      );

    case "colorpicker":
    case "color":
    case "color_code":
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <input
            type="color"
            name={name}
            value={formData[name] || "#000000"}
            onChange={handleChange}
            disabled={loading}
            style={{ width: 50, height: 40, borderRadius: 6, cursor: "pointer", padding: 0 }}
            {...props}
          />
          <ReTextField
            label={label || "Color Code"}
            name={name}
            value={formData[name] || "#000000"}
            onChange={handleChange}
            disabled={loading}
            fullWidth
            {...getErrorProps()}
          />
        </Box>
      );

    default:
      return (
        <ReTextField
          fullWidth
          label={label}
          name={name}
          type={type || "text"}
          value={formData[name] || ""}
          onChange={handleChange}
          disabled={loading}
          {...getErrorProps()}
          {...props}
        />
      );
  }
};

export default CommonFormField;

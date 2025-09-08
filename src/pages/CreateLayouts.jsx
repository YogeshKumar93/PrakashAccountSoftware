import React, { useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";

const CreateLayouts = ({ open, handleClose, handleSave }) => {
  const {
    schema,
    formData,
    handleChange,
    errors,
    setErrors,
    loading,
  } = useSchemaForm(ApiEndpoints.GET_COLOR_SCHEMA, open); // 👈 use schema API

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ API submit
  const onSubmit = async () => {
    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_COLOUR,
        formData
      );

      if (response) {
        showToast(response?.message || "Colour created successfully", "success");
        handleSave(response.data);
        handleClose();
      } else {
        showToast(error?.message || "Failed to create colour", "error");
      }
    } catch (err) {
      console.error("Error creating colour:", err);
      showToast("Something went wrong while creating colour.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Footer buttons
  const footerButtons = [
    {
      text: "Cancel",
      variant: "outlined",
      onClick: handleClose,
      disabled: submitting,
    },
    {
      text: submitting ? "Saving..." : "Save",
      variant: "contained",
      onClick: onSubmit,
      disabled: submitting,
      startIcon:
        submitting ? <CircularProgress size={20} color="inherit" /> : null,
    },
  ];

  // Optional: filter only needed fields from schema
  const visibleFields = schema.filter((field) =>
    ["name", "element_type", "color_code"].includes(field.name)
  );

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Create Colours"
      footerButtons={footerButtons}
      size="medium"
      iconType="info"
      showCloseButton={true}
      closeOnBackdropClick={!submitting}
      dividers={true}
      fieldConfig={visibleFields} // 👈 schema-driven fields
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading || submitting}
      layout="two-column"
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: "block" }}
      >
        * Status will be set to Active (1) by default
      </Typography>
    </CommonModal>
  );
};

export default CreateLayouts;

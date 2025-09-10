import React, { useState } from "react";
import { Typography, CircularProgress, TextField, Box } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";

const CreateAccountStatement = ({ open, handleClose, handleSave,onFetchRef }) => {
  const {
    schema,
    formData,
    handleChange,
    setFormData,
    errors,
    loading,
  } = useSchemaForm(ApiEndpoints.GET_ACCOUNT_STATEMENT_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Auto sync element_type when name changes
  const handleNameChange = (e) => {
    const selectedName = e.target.value;

    const nameField = schema.find((f) => f.name === "name");

    if (nameField && Array.isArray(nameField.options)) {
      const matched = nameField.options.find((opt) => opt.value === selectedName);

      if (matched) {
        setFormData((prev) => ({
          ...prev,
          name: matched.value,
          element_type: matched.value,
        }));
        return;
      }
    }

    handleChange(e);
  };

  // ✅ API submit
  const onSubmit = async () => {
    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_ACCOUNT_STATEMENT,
        formData
      );

      if (response) {
        showToast(response?.message || "Colour created successfully", "success");
        handleSave(response.data);
        onFetchRef();
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

  // visible fields (without color_code → we’ll render it manually)
  const visibleFields = schema.filter((field) =>
    ["Date/Time","name", "element_type","","","     "].includes(field.name)
  );

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Create Account Statement"
      footerButtons={footerButtons}
      size="medium"
      iconType="info"
      showCloseButton={true}
      closeOnBackdropClick={!submitting}
      dividers={true}
      fieldConfig={visibleFields}
      formData={formData}
      handleChange={(e) =>
        e.target.name === "name" ? handleNameChange(e) : handleChange(e)
      }
      errors={errors}
      loading={loading || submitting}
      layout="two-column"
    >
     
      

  
    </CommonModal>
  );
};

export default CreateAccountStatement;

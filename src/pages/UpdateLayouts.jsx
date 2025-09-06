import React, { useState, useEffect } from "react";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { CircularProgress } from "@mui/material";

const UpdateLayouts = ({ open, handleClose, handleSave, selectedLayout }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    color_code: "",
    element_type: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Pre-fill data when modal opens
  useEffect(() => {
    if (selectedLayout) {
      setFormData({
        id: selectedLayout.id || "",
        name: selectedLayout.name || "",
        color_code: selectedLayout.color_code || "",
        element_type: selectedLayout.element_type || "",
      });
    }
  }, [selectedLayout, open]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit update
  const onSubmit = async () => {
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "POST", // change to PUT/PATCH if backend requires
              `${ApiEndpoints.UPDATE_COLOUR} `,
        formData
      );

      if (response) {
        handleSave(response.data); // update parent state
        handleClose();
      } else {
        console.error("Failed to update layout:", error || response);
      }
    } catch (err) {
      console.error("Error updating layout:", err);
      alert("Something went wrong while updating layout.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Footer buttons
  const footerButtons = [
    {
      text: "Cancel",
      variant: "outlined",
      onClick: handleClose,
      disabled: loading,
    },
    {
      text: "Update",
      variant: "contained",
      onClick: onSubmit,
      disabled: loading,
      startIcon: loading ? <CircularProgress size={20} color="inherit" /> : null,
    },
  ];

  // ✅ Field Config (like FundRequest)
  const fieldConfig = [
    { name: "name", label: "Name", type: "text" },
    { name: "color_code", label: "Colour Code", type: "color" },
    { name: "element_type", label: "Element Type", type: "text" },
  ];

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Update Layout"
      footerButtons={footerButtons}
      size="medium"
      iconType="info"
      layout="two-column"
      showCloseButton={true}
      closeOnBackdropClick={!loading}
      dividers={true}
      fieldConfig={fieldConfig}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading}
    />
  );
};

export default UpdateLayouts;

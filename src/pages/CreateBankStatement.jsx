import React, { useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";

const CreateBankStatement = ({ open, handleClose,onFetchRef }) => {
  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.GET_BANK_STATEMENT_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Submit
  const handleSubmit = async () => {

    setSubmitting(true);
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_BANK_STATEMENT,
        formData
      );

      if (response) {
        showToast(
          response?.message || "Account Statement Created successfully",
          "success"
        );
        onFetchRef();
        handleClose();
      } else {
        showToast(error?.message || "Failed to create Account Statement", "error");
        handleClose();
      }

  };

  // ✅ Required fields
  const requiredFields = [
    
    "account_id",
    "remarks",
    "claimed_by",
    "bank_id",
    "credit",
    "status",
    "date",
    "debit",
    "balance",
    "particulars"

  
  ];

  // ✅ Pick only required fields from schema
  let visibleFields = schema.filter((field) =>
    requiredFields.includes(field.name)
  );

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Create Bank Statement"
      iconType="info"
      size="medium"
      layout="two-column"
      dividers
      fieldConfig={visibleFields}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading || submitting}
      footerButtons={[
        {
          text: "Cancel",
          variant: "outlined",
          onClick: handleClose,
          disabled: submitting,
        },
        {
          text: submitting ? "Saving..." : "Save",
          variant: "contained",
          color: "primary",
          onClick: handleSubmit,
          disabled: submitting,
        },
      ]}
    />
  );
};

export default CreateBankStatement;

import React, { useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { PATTERNS, isValid } from "../utils/validators";
import { useToast } from "../utils/ToastContext";

const CreateFundRequest = ({ open, handleClose, handleSave }) => {
  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.GET_FUNDREQUEST_SCHEMA, open);

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};

    if (!isValid(PATTERNS.TXN_ID, formData.txn_id || "")) {
      newErrors.txn_id = "Enter a valid TXN ID (6–20 alphanumeric chars)";
    }

    if (!formData.bank_name) {
      newErrors.bank_name = "Bank is required";
    }

    if (!formData.mode) {
      newErrors.mode = "Mode is required";
    }

    if (!isValid(PATTERNS.IFSC, formData.bank_ref_id || "")) {
      newErrors.bank_ref_id = "Enter a valid Bank Ref ID";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Enter a valid amount";
    }

    if (formData.remark && formData.remark.length > 200) {
      newErrors.remark = "Remarks cannot exceed 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_FUND_REQUEST,
        formData
      );

      if (response) {
        handleSave(response.data);
        showToast(response?.message || "Fund request created successfully", "success");
        handleClose();
      } else {
        showToast(error?.message || "Failed to create fund request", "error");
      }
    } catch (err) {
      console.error("Error creating fund request:", err);
      showToast("Something went wrong while creating fund request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Required fields
  const requiredFields = [
    "txn_id",
    "bank_name",
    "mode",
    "bank_ref_id",
    "date",
    "amount",
    "remark",
  ];

  // ✅ Pick only required fields from schema
  let visibleFields = schema.filter((field) => requiredFields.includes(field.name));

const bankField = {
  name: "bank_name",
  label: "Bank Name",
  type: "select",
  apiOptions: {
    endpoint: ApiEndpoints.GET_BANKS,
    method: "post",
    mapOptions: (responseData) => {
        console.log("Mapping banks:", responseData);
      // responseData is already the array of banks
      return (responseData || []).map((bank) => ({
        value: bank.id.toString(),
        label: bank.bank_name,
      }));
    },
  },
};

  // Replace or insert bank_name field
  const hasBank = visibleFields.find((f) => f.name === "bank_name");
  if (hasBank) {
    visibleFields = visibleFields.map((f) => (f.name === "bank_name" ? bankField : f));
  } else {
    visibleFields.splice(1, 0, bankField); // insert after txn_id
  }

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Create Fund Request"
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

export default CreateFundRequest;

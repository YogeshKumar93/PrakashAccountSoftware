import React, { useContext, useState } from "react";
import { Box, CircularProgress, Button } from "@mui/material";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";
import CommonFormField from "../common/CommonFormField";
import AuthContext from "../../contexts/AuthContext";

export const BusinessInformation = ({ open, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const authCtx = useContext(AuthContext);
  const loadUserProfile = authCtx.loadUserProfile;

  // Only KYC form
  const kyc = useSchemaForm(ApiEndpoints.KYC_SCHEMA, true);

  const handleSubmit = async () => {
    const { schema, formData } = kyc;

    if (!schema || !schema.length) {
      showToast("Schema not loaded yet", "error");
      return;
    }

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_KYC,
        {
          ...formData,
          status: 2,
        }
      );

      console.log("📌 API Response:", response);

      if (response) {
        showToast(response?.message || "KYC saved successfully", "success");
        loadUserProfile();

        // Optionally, you can show a final success message for all steps completed
        showToast(
          "🎉 All steps completed! Business information is done.",
          "success"
        );
      } else {
        showToast(error?.message || "Failed to save KYC", "error");
      }
    } catch (err) {
      console.error("❌ Error saving KYC:", err);
      showToast("Something went wrong while saving", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* KYC Form */}
      {kyc.loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {kyc.schema.map((field, i) => (
            <CommonFormField
              key={i}
              field={field}
              formData={kyc.formData}
              handleChange={kyc.handleChange}
              errors={kyc.errors}
              loading={kyc.loading}
            />
          ))}

          {/* Footer Buttons */}
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={submitting || kyc.loading}
            >
              {submitting ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

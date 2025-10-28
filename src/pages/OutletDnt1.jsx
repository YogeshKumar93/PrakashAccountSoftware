import React, { useContext, useState } from "react";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";
import { apiCall } from "../api/apiClient";
import MpinInput from "./MpinInput";
import Loader from "../components/common/Loader";

const OutletDmt1 = ({ open, handleClose, onSuccess }) => {
  const { schema, formData, handleChange, errors, loading } = useSchemaForm(
    ApiEndpoints.DMT1_OUTLET_INITIATE_SCHEMA,
    open
  );

  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { location } = useContext(AuthContext);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [initPayload, setInitPayload] = useState(null);
  const [otpError, setOtpError] = useState("");

  // ✅ Submit Handler
  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      ...formData,
      latitude: location?.lat || "",
      longitude: location?.long || "",
    };

    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.DMT1_OUTLET_INITIATE,
      payload
    );

    if (response) {
      showToast(
        response?.message || "DMT1 Outlet initiated successfully",
        "success"
      );

      setInitPayload({
        ...payload,
        otpReferenceID: response?.data?.otpReferenceID,
        hash: response?.data?.hash,
        hash2: response?.data?.hash,
      });

      setOtpModalOpen(true);
    } else {
      showToast(error?.message || "Failed to initiate DMT1 outlet", "error");
      handleClose();
    }
    setSubmitting(false);
  };

  // ✅ OTP Submit handler
  const handleOtpSubmit = async (pin) => {
    setOtpError("");
    setSubmitting(true);
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.VALIDATE_DMT1_OUTLET,
      {
        ...initPayload,
        otp: pin,
      }
    );

    if (response) {
      showToast("OTP Verified Successfully", "success");
      if (onSuccess) onSuccess();
      setOtpModalOpen(false);
      handleClose();
    } else {
      setOtpError(error?.message || "OTP Validation Failed");
    }
    setSubmitting(false);
  };

  // ✅ Required fields
  const requiredFields = [
    "mobile",
    "pan",
    "email",
    "bankAccountNo",
    "bankIfsc",
    "aadhaar",
  ];

  const visibleFields = schema.filter((field) =>
    requiredFields.includes(field.name)
  );

  return (
    <Loader loading={submitting || loading}>
      {/* Main Outlet Form */}
      <CommonModal
        open={open}
        onClose={handleClose}
        title="Enable DMT1 Outlet"
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
            text: submitting ? "Submitting..." : "Submit",
            variant: "contained",
            color: "primary",
            onClick: handleSubmit,
            disabled: submitting,
          },
        ]}
      />

      {/* ✅ OTP / MPIN Dialog */}
      <MpinInput
        open={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        title="Enter OTP"
        length={6}
        onSubmit={handleOtpSubmit}
        submitting={submitting}
        errorMsg={otpError}
      />
    </Loader>
  );
};

export default OutletDmt1;

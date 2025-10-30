import React, { useEffect } from "react";

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.CREATE_BANK_STATEMENT,
      formData
    );

    if (response) {
      showToast(response?.message || "Statement Created", "success");
      onFetchRef?.();
      setFormData(getDefaultFormData()); // reset form after submission
    } else {
      showToast(error?.message || "Failed to create Statement", "error");
    }
    setSubmitting(false);
  };
 
  const getDefaultFormData = () => ({
    bank_id: bankId,
    balance: balance || 0,
    date: new Date().toISOString().split("T")[0],
    credit: 0,
    debit: 0,
    mop: "",
    handle_by: "",
    particulars: "",
  });
const UploadExcel = () => {
  

 

 
  return (
  <></>  
  )
};

export default UploadExcel;

import React, { useState } from 'react'
import CommonModal from '../components/common/CommonModal'
import { apiCall } from '../api/apiClient';
import ApiEndpoints from '../api/ApiEndpoints';

const CreateFundRequest = ({open, handleClose, handleSave}) => {

const [formData, setFormData] = useState({
    bank_name: "",
    status: "",
    asm_id: "",
    user_id: "",
    name: "",
    mode: "",
    bank_ref_id: "",
    date: "",
    amount: "",
    remark: "",
    txn_id:"",
});

const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const onSubmit = async () => {
    // if (!validate()) return;
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_FUND_REQUEST,
        formData
      );

      if (response) {
        handleSave(response.data);
        handleClose();
        setFormData({
           bank_name: "",
    status: "",
    asm_id: "",
    user_id: "",
    name: "",
    mode: "",
    bank_ref_id: "",
    date: "",
    amount: "",
    remark: "",
    txn_id:"",
        });
      } else {
        console.error("Failed to create account:", error || response);
      }
    } catch (err) {
      console.error("Error creating account:", err);
      alert("Something went wrong while creating account.");
    } finally {
      setLoading(false);
    }
  };

  const footerButtons = [
      {
        text: "Cancel",
        variant: "outlined",
        onClick: handleClose,
        disabled: loading,
      },
      {
        text: "Save",
        variant: "contained",
        onClick: onSubmit,
        disabled: loading,
        startIcon: loading ? <CircularProgress size={20} color="inherit" /> : null,
      },
    ];

    const fieldConfig = [
        {name: "bank_name", label: "Name", type:"text" },
        {name: "status", label:"Status", type: "select", options:[
            {value: "Pending", label: "Pending"},
            {value: "Failed", label: "Failed"},
            {value: "Success", label:"Success"},
        ]},
        {name:"asm_id", label: "Asm Id", type: "text" },
        {name:"user_id", label:"User Id", type: "text"},
        {name:"name", label:"Name", type:"text"},
         {name:"mode", label:"Mode", type:"text"},
          {name:"bank_ref_id", label:"Band Ref Id", type:"text"},
          {name:"date", label:"Date", type:"text"},
        {name:"amount", label:"Amount", type:"text"},
         {name:"remark", label:"Remarks", type:"text"},
          {name:"txn_id", label:"TXN ID", type:"text"},

    ]

    return (
    
<CommonModal
 open={open}
      onClose={handleClose}
      title="Create Account"
      footerButtons={footerButtons}
      size="medium"
      iconType="info"
      showCloseButton={true}
      closeOnBackdropClick={!loading}
      dividers={true}
      fieldConfig={fieldConfig} // ✅ pass config
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading}
      layout="two-column"
>


</CommonModal>

  )
}

export default CreateFundRequest

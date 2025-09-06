
import React, { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";

const CreateLayouts = ({ open, handleClose, handleSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    color_code: "",
    element_type: "",
     
 
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [colorOptions, setColorOptions] = useState([]);

  useEffect(()=>{
    if(open){
        fetchColors();
    }
  },[open]);

  const fetchColors = async () =>{
    try{
        const{response,error} = await apiCall("POST", ApiEndpoints.GET_COLOR_SCHEMA);
        if(response){
            setColorOptions(response?.data?.data || []);

        }else{
            console.error('Error fetching colors: ', error);
        }
    }
    catch(err){
        console.error("Error fetching colors: ", err);
    }
  };


  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ API submit
  const onSubmit = async () => {
    // if (!validate()) return;
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_COLOUR,
        formData
      );

      if (response) {
        handleSave(response.data);
        handleClose();
        setFormData({
          name: "",
          color_code: "",
          element_type: "",
           
          
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

  // ✅ Footer buttons
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

  // ✅ Field configuration
  const fieldConfig = [
    { name: "name", label: "Name", type: "text" },
       { name: "element_type", label: "Element Type", type: "text" },
 {
    name: "color_code",
    label: "Color Picker",
    type: "color",   // ✅ use color input instead of select
  },
 
    
  ];

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Create Colours"
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
      layout="two-column" // ✅ NEW: tell CommonModal to render 2 fields/row
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

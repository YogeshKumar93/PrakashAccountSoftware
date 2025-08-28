import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FormControl, Grid, TextField, Typography, Button } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../../contexts/AuthContext";
import { apiCall } from "../../../api/apiClient";
import ApiEndpoints from "../../../api/ApiEndpoints";
import Loader from "../../common/Loader";

const DmtAddRemModal = ({
  rem_mobile,
  getRemitterStatus,
  apiEnd,
  view,
  setAddNewRem,
  verifyRem,
  setVerifyRem,
  otpRef,
  setOtpRef,
  dmtValue,
  remRefKey,
  setRemRefKey,
  setDmr2RemRes,
  dmr2RemRes,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [mobile, setMobile] = useState(rem_mobile || "");
  const [otpRefId, setOtpRefId] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [firstName, setFirstName] = useState(""); // Added state for first name
  const [lastName, setLastName] = useState(""); // Added state for last name
  const [remName, setRemName] = useState(""); // Added state for remitter name
  const authCtx = useContext(AuthContext);
  const { user, location } = authCtx;
  const { lat: userLat, long: userLong } = location;

  useEffect(() => {
    setOpen(true);
  }, [mobile]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "70%", md: "40%" },
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    maxHeight: "90vh",
    overflowY: "auto",
    p: 2,
    borderRadius: 2,
  };

  const handleClose = () => {
    setOpen(false);
    if (setAddNewRem) setAddNewRem(false);
    if (setOtpRef) setOtpRef(null);
    if (remRefKey) setRemRefKey({});
    if (onClose) onClose();
    if (timerInterval) clearInterval(timerInterval);
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setRequest(true);
    
    try {
      let data = {};
      
      if (view && view === "upiTransfer") {
        data = {
          rem_number: mobile,
          name: remName,
          latitude: userLat,
          longitude: userLong,
        };
      } else if (dmtValue === "dmt1" || dmtValue === "dmt4") {
        data = {
          aadhaar_number: aadhaarNumber,
          number: mobile,
          referenceKey: remRefKey?.referenceKey??null,
          latitude: userLat,
          longitude: userLong,
        };
      } else if (dmtValue === "dmt2" || dmtValue === "st") {
        data = {
          first_name: firstName,
          last_name: lastName,
          number: mobile,
          latitude: userLat,
          longitude: userLong,
        };
      } else {
        data = {
          first_name: firstName,
          last_name: lastName,
          number: mobile,
          latitude: userLat,
          longitude: userLong,
        };
      }

      if (showOtp || otpRef) {
        let endpoint;
        if (verifyRem) {
          endpoint = ApiEndpoints.VERIFY_REM_UPI;
        } else if (view === "expressTransfer" || dmtValue === "dmt1") {
          endpoint = ApiEndpoints.VALIDATE_EXP_OTP;
        } else if (dmtValue === "st") {
          endpoint = ApiEndpoints.VALIDATE_SUP_OTP;
        } else {
          endpoint = ApiEndpoints.VALIDATE_OTP;
        }

        const { error, response } = await apiCall("POST", endpoint, {
          rem_number: mobile,
          otp: otpValue,
          otpReference: otpRefId || otpRef,
          referenceKey: remRefKey?.referenceKey,
          latitude: userLat,
          longitude: userLong,
        });

        if (error) throw error;

        if (getRemitterStatus) {
          getRemitterStatus(mobile);
        }
        handleClose();
      } else {
        const { error, response } = await apiCall("POST", apiEnd, data);

        if (error) throw error;

        const responseData = response.data;
        setShowOtp(true);
        
        // Handle OTP response
        if (responseData?.otp_ref_id || responseData?.data?.otpReferenceID) {
          setOtpRefId(responseData.otp_ref_id || responseData.data.otpReferenceID);
        
          // Start timer if validity exists
          if (responseData.data?.validity) {
            startTimer(responseData.data.validity);
          }
        } else if (responseData?.data?.referenceKey) {
          setRemRefKey(responseData.data);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setRequest(false);
    }
  };

  const startTimer = (validity) => {
    const validityDate = new Date(validity);

    if (isNaN(validityDate.getTime())) {
      console.error("Invalid validity:", validity);
      setRemainingTime("Invalid time");
      return;
    }

    const updateRemainingTime = () => {
      const currentTime = new Date();
      const diffTime = validityDate - currentTime;

      if (diffTime <= 0) {
        clearInterval(timerInterval);
        setRemainingTime("Time expired");
      } else {
        setRemainingTime(diffTime);
      }
    };

    // Clear any existing interval
    if (timerInterval) clearInterval(timerInterval);
    
    const intervalId = setInterval(updateRemainingTime, 1000);
    setTimerInterval(intervalId);
    updateRemainingTime(); // Initial call

    return () => {
      clearInterval(intervalId);
    };
  };

  const formatRemainingTime = (time) => {
    if (time === "Invalid time" || time === "Time expired") {
      return time;
    }

    const totalSeconds = Math.floor(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (remainingTime === "Time expired") {
      handleClose();
    }
  }, [remainingTime]);

  // Define form fields based on view and dmtValue
  const getFormFields = () => {
    const baseFields = [
      {
        id: "mobile",
        label: "Mobile Number",
        value: mobile,
        disabled: showOtp || otpRef,
        inputProps: { maxLength: 10 },
        onChange: (e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)),
        xs: 12
      }
    ];

    if (view === "upiTransfer") {
      return [
        ...baseFields,
        {
          id: "rem_name",
          label: "Name",
          value: remName,
          disabled: showOtp || otpRef,
          inputProps: { minLength: 3 },
          onChange: (e) => setRemName(e.target.value),
          xs: 12
        }
      ];
    }

    if (dmtValue === "dmt1" || dmtValue === "dmt4") {
      return [
        ...baseFields,
        {
          id: "aadhaar_number",
          label: "Aadhaar Number",
          value: aadhaarNumber,
          disabled: showOtp || otpRef,
          inputProps: { maxLength: 12 },
          onChange: (e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12)),
          xs: 12
        }
      ];
    }

    if (dmtValue === "dmt2" || dmtValue === "st") {
      return [
        ...baseFields,
        {
          id: "first_name",
          label: "First Name",
          value: firstName,
          disabled: showOtp || otpRef,
          inputProps: { minLength: 3 },
          onChange: (e) => setFirstName(e.target.value),
          xs: 12,
          sm: 6
        },
        {
          id: "last_name",
          label: "Last Name",
          value: lastName,
          disabled: showOtp || otpRef,
          inputProps: { minLength: 3 },
          onChange: (e) => setLastName(e.target.value),
          xs: 12,
          sm: 6
        }
      ];
    }

    return baseFields;
  };

  // Add OTP field if needed
  const formFields = (showOtp || otpRef) 
    ? [
        ...getFormFields(),
        {
          id: "otp",
          label: "OTP",
          value: otpValue,
          inputProps: { maxLength: 6 },
          onChange: (e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setOtpValue(value);
          },
          xs: 12
        }
      ]
    : getFormFields();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="sm_modal">
        <Loader loading={request} />
        
        <Typography variant="h6" component="h2" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
          Add Remitter
        </Typography>
        
        <Box
          component="form"
          id="add_rem"
          validate
          autoComplete="off"
          onSubmit={handleSubmit}
          sx={{ "& .MuiTextField-root": { mb: 2 } }}
        >
          <Grid container spacing={2}>
            {formFields.map((field) => (
              <Grid item xs={field.xs} sm={field.sm || 12} key={field.id}>
                <FormControl fullWidth>
                  <TextField
                    label={field.label}
                    id={field.id}
                    name={field.id}
                    size="small"
                    required={field.id !== "otp"}
                    disabled={field.disabled}
                    value={field.value || ""}
                    inputProps={field.inputProps}
                    onChange={field.onChange}
                  />
                </FormControl>
                
                {field.id === "otp" && remainingTime && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      textAlign: "center",
                      color: remainingTime === "Time expired" ? "error.main" : "success.main",
                      fontWeight: 500,
                    }}
                  >
                    Remaining Time: {formatRemainingTime(remainingTime)}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={request}
              sx={{ minWidth: 100 }}
            >
              {request ? 'Processing...' : (showOtp || otpRef) ? 'Verify OTP' : 'Send OTP'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DmtAddRemModal;
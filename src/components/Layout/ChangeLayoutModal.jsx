import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect } from "react";

import { useState } from "react";
import { useContext } from "react";

import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../common/CommonModal";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonMpinModal from "../common/CommonMpinModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const ChangeLayoutModal = ({ open, onClose, onSuccess, username }) => {
  const { showToast } = useToast();
  const [request, setRequest] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const [MpinCallBackVal, setMpinCallBackVal] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [value, setValue] = React.useState(user?.layout * 1);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const newValue = event.target.value * 1;
    setSelectedLayout(newValue);
    setMpinModalOpen(true); // Open MPIN modal when layout is selected
  };

  const changeSwitch = useCallback(
    (mpin) => {
      if (!selectedLayout) return;

      const data = { is_layout: selectedLayout, mpin: mpin * 1 };
      setRequest(true);

      apiCall(
        "post",
        ApiEndpoints.CHANGE_USER_LAYOUT,
        data,
        null,
        (res) => {
          const data = res?.data?.data;
          authCtx.saveUser(data);

          setMpinCallBackVal(false);
          setTimeout(() => {
            if (data.layout === 2) navigate("/customer/services");
          }, 800);

          onClose();
          setRequest(false);
          if (onSuccess) onSuccess("Layout changed successfully");
        },
        (err) => {
          showToast(err, "error");
          setRequest(false);
          setMpinCallBackVal(false);
        }
      );
    },
    [selectedLayout, authCtx, navigate, onClose, onSuccess, showToast]
  );

  useEffect(() => {
    if (MpinCallBackVal && selectedLayout) {
      changeSwitch(MpinCallBackVal);
    }
  }, [MpinCallBackVal, selectedLayout, changeSwitch]);

  const handleClose = () => {
    setSelectedLayout(null);
    setMpinCallBackVal(false);
    onClose();
  };

  return (
    <>
      <CommonModal
        open={open}
        title="Choose between layouts"
        onClose={handleClose}
        footerButtons={[]}
      >
        <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
              row
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 4 },
              }}
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        mb: 2,
                        textAlign: "center",
                        textDecoration:
                          value === 1 ? "underline solid #4045A1 3px" : "none",
                        fontWeight: value === 1 ? "bold" : "normal",
                        color: value === 1 ? "#4045A1" : "inherit",
                      }}
                    >
                      Default Layout
                    </Typography>
                    {/* <img src={defaultLayout} alt="default" width="300px" /> */}
                    <Box
                      sx={{
                        width: { xs: 200, sm: 250, md: 300 },
                        height: 150,
                        bgcolor: value === 1 ? "primary.main" : "grey.200",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: value === 1 ? "white" : "grey.500",
                      }}
                    >
                      Default Layout Preview
                    </Box>
                  </Box>
                }
                labelPlacement="top"
                sx={{ m: 0 }}
              />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        mb: 2,
                        textAlign: "center",
                        textDecoration:
                          value === 2 ? "underline solid #4045A1 3px" : "none",
                        fontWeight: value === 2 ? "bold" : "normal",
                        color: value === 2 ? "#4045A1" : "inherit",
                      }}
                    >
                      Services Layout
                    </Typography>
                    {/* <img src={servicelayout} alt="new_nav" width="300px" /> */}
                    <Box
                      sx={{
                        width: { xs: 200, sm: 250, md: 300 },
                        height: 150,
                        bgcolor: value === 2 ? "secondary.main" : "grey.200",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: value === 2 ? "white" : "grey.500",
                      }}
                    >
                      Services Layout Preview
                    </Box>
                  </Box>
                }
                labelPlacement="top"
                sx={{ m: 0 }}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </CommonModal>
      {/* MPIN Verification Modal */}
      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        mPinCallBack={(mPinValue) => {
          setMpinCallBackVal(mPinValue);
        }}
        title="Verify MPIN to Change Layout"
        onClose={() => {
          setMpinModalOpen(false);
          setSelectedLayout(null);
        }}
      />
    </>
  );
};

export default ChangeLayoutModal;

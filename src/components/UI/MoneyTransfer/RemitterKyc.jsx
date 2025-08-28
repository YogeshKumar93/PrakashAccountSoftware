import {
  Box,
  Modal,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
} from "@mui/material";
import React, { useState, useContext, useEffect } from "react";

import AnimDeviceConnect from "../assets/animate-icons/device_connect.json";
import AnimDeviceReady from "../assets/animate-icons/device_ready.json";
import AnimDeviceScanning from "../assets/animate-icons/fingerprint_scan.json";
import AnimDeviceSuccess from "../assets/animate-icons/fingerprint_success.json";
import AnimDeviceFail from "../assets/animate-icons/fingerprint_fail.json";
import AuthContext from "../store/AuthContext";
import useCommonContext from "../store/CommonContext";
import {
  CaptureFingerPrint,
  GetMFS100InfoLoad,
  CaptureFingerPrintDmt1,
  CaptureFingerPrintDmt2,
} from "../utils/MantraCapture";
import { RDDeviceStatus } from "../utils/constants";
import ApiEndpoints from "../network/ApiEndPoints";
import { postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import MachineButtonGroup from "../component/aeps/MachineButtonGroup";
import RdDeviceSearch from "../component/RdDeviceSearch";
import Loader from "../commons/Spinner";
import ModalHeader from "./ModalHeader";
const RemitterKyc = ({
  open,
  onClose,
  remRefKey,
  rem_mobile,
  dmtValue,
  setVerifyotp,
  setDmr2RemRes,
  aadhaarNumber,
  getRemitterStatus,
}) => {
  const [scanData, setScanData] = useState(null);
  const [scanAnim, setScanAnim] = useState("NOTREADY");
  const authCtx = useContext(AuthContext);
  const userLat = authCtx.location.lat;
  const userLong = authCtx.location.long;
  const [request, setRequest] = useState(false);
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState();
  const { setDynamicWadh, dynamicWadh } = useCommonContext();

  console.log("dynamicWadh in kyc", dynamicWadh);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: "max-content",
    overflowY: "scroll",
    p: 2,
  };

  const {
    aepsType,
    rdDevice,
    rdDeviceList,
    machineRequest,
    setRdDevice,
    setRdDeviceList,
    setMachineRequest,
  } = useCommonContext();
  const handleOpen = () => {
    if (!rdDevice) getRdDeviceInfo();
    // setOpen(true);
  };
  const handleClose = () => {
    onClose();
    // setOpen(false);
    setScanData(null);
  };

  function getRdDeviceInfo() {
    setMachineRequest(true);
    // console.log("machine func call . . .");
    setTimeout(() => {
      // console.log("inside machine func timeout . . .");
      GetMFS100InfoLoad(
        setMachineRequest,
        (dataArray) => {
          setScanData();
          // setScanAnim(RDDeviceStatus.NOT_READY);
          for (let i = 0; i < dataArray.length; i++) {
            // console.log("data array=>", dataArray[i].status);
            const data = dataArray[i];
            if (data && data.status === RDDeviceStatus.READY) {
              setScanAnim(data ? data.status : RDDeviceStatus.SCAN_FAILED);
              setRdDevice(data);
            } else if (data && data.status === RDDeviceStatus.NOT_READY) {
              setScanAnim(data ? data.status : RDDeviceStatus.SCAN_FAILED);
              setRdDevice(data);
            }
          }
          if (dataArray) setRdDeviceList(dataArray);
          // console.log("success status=>", machineRequest);
        },
        (err) => {
          setScanAnim(RDDeviceStatus.NOT_READY);
          setRdDevice();
          setRdDeviceList();
          setMachineRequest(false);
          setScanData();
          // setScanAnim(err ? err.status : RDDeviceStatus.SCAN_FAILED);
          // console.log("failed status=>", machineRequest);
        }
      );
    }, 500);
    // setMachineRequest(false);
  }

  function resolveScanImage(status) {
    switch (status) {
      case RDDeviceStatus.NOT_READY:
        return <AnimateIcon src={AnimDeviceConnect} />;
      case RDDeviceStatus.READY:
        return <AnimateIcon src={AnimDeviceReady} />;
      case RDDeviceStatus.SCANNING:
        return <AnimateIcon src={AnimDeviceScanning} />;
      case RDDeviceStatus.SCAN_SUCCESS:
        return <AnimateIcon src={AnimDeviceSuccess} />;
      case RDDeviceStatus.SCAN_FAILED:
        return <AnimateIcon src={AnimDeviceFail} />;
      default:
        return <AnimateIcon src={AnimDeviceConnect} />;
    }
  }

  // ------------------------------------------
  // api call for logging in to bank side for the day

  // ------------------------------------------

  const outletAuthApiCall = () => {
    const apiEnd =
      dmtValue == "dmt1"
        ? ApiEndpoints.REMITTER_KYC
        : dmtValue == "dmt3"
        ? ApiEndpoints.REGISTER_REMITTER_DMT3
        : ApiEndpoints.REMITTER_KYC_dmt2;

    if (scanData) {
      const dmt1Data = {
        referenceKey: remRefKey?.referenceKey,
        number: rem_mobile,
        ci: scanData.cI,
        dc: scanData.dC,
        dpId: scanData.dpId,
        mc: scanData?.mC,
        mi: scanData?.mI,
        pidData: scanData?.pidData,
        rdsId: scanData?.rdsId,
        rdsVer: scanData?.rdsVer,
        sessionKey: scanData?.sessionKey,
        srno: scanData?.srno,
        hmac: scanData?.hMac,
        // latitude:"28.6668",
        // longitude:"77.2167",
        latitude: userLat.toFixed(4),
        longitude: userLong.toFixed(4),
        pf: "WEB",
      };
      const dmt2Data = {
        referenceKey: remRefKey?.referenceKey,
        number: rem_mobile,
        aadhaar_number: aadhaar && aadhaar,
        pidData: scanData?.doc,
        latitude: userLat.toFixed(4),
        longitude: userLong.toFixed(4),
        pf: "WEB",
      };
      const dmt3Data = {
        otp: otp,
        stateresp: remRefKey,
        mobile: rem_mobile,
        aadhaar_number: aadhaarNumber,
        pidData: scanData?.doc2,
        latitude: userLat.toFixed(4),
        longitude: userLong.toFixed(4),
        pf: "WEB",
      };

      const apiData =
        dmtValue == "dmt1"
          ? dmt1Data
          : dmtValue == "dmt3"
          ? dmt3Data
          : dmt2Data;
      if (scanData.dpId || dmt2Data.pidData) {
        postJsonData(
          apiEnd,
          apiData,
          setRequest,
          (res) => {
            if (dmtValue === "dmt1") {
              getRemitterStatus(rem_mobile);
            }
            console.log("rem kyc res----", res);
            if (dmtValue == "dmt2") {
              setDmr2RemRes(res?.data?.data);
              setVerifyotp(true);
            }
            okSuccessToast(res.data.message);

            onClose();
            setScanData(null);
          },
          (error) => {
            console.log("rem kyc error", error);
            setVerifyotp(true);
            apiErrorToast(error);
          }
        );
      } else {
        apiErrorToast("Please scan the correct finger");
      }
      console.log("scan data======>", scanData);
    }
  };

  useEffect(() => {
    if (scanData) outletAuthApiCall();
  }, [scanData]);
  function getColor(status) {
    if (status === "NOTREADY") {
      return "red";
    } else if (status === "READY") {
      return "green";
    } else {
      return "red";
    }
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="sm_modal">
        <Loader circleBlue loading={request} />

        <ModalHeader title="Add Remitter" handleClose={onClose} />
        {/* <Button
          onClick={() => {
            const mockScanData = {
              cI: "mockCi",
              dC: "mockDc",
              dpId: "mockDpId",
              mC: "mockMc",
              mI: "mockMi",
              pidData: "mockPidData",
              rdsId: "mockRdsId",
              rdsVer: "mockRdsVer",
              sessionKey: "mockSessionKey",
              srno: "mockSrno",
              hMac: "mockHmac",
              doc2: "8yyhhjnb",
            };
            setScanData(mockScanData);
            outletAuthApiCall(); // Trigger the API manually with mock data
          }}
        >
          Test API Call
        </Button> */}

        <Box
          component="form"
          id="outlet_login"
          validate
          autoComplete="off"
          className="text-center"
          // onSubmit={}
          sx={{
            "& .MuiTextField-root": { m: 2 },
            objectFit: "contain",
            display: "grid",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container className="position-relative">
            {(dmtValue === "dmt2" || dmtValue === "dmt3") && (
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Aadhaar Number"
                    id="aadhaarNo"
                    size="small"
                    type="number"
                    // Conditionally render the helperText based on the dmtValue
                    helperText={
                      dmtValue === "dmt3" ? null : (
                        <div style={{ color: "#2979ff" }}>
                          Kindly check for your Aadhaar Number
                        </div>
                      )
                    }
                    required
                    disabled={dmtValue === "dmt3"}
                    value={dmtValue === "dmt3" ? aadhaarNumber : aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                  />
                </FormControl>
              </Grid>
            )}

            {dmtValue == "dmt3" && (
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Enter OTP"
                    id="otp"
                    size="small"
                    type="number"
                    helperText={
                      <div style={{ color: "green" }}>
                        Aadhar validated successfully and OTP has been sent to
                        register remitter for registration, please enter valid
                        OTP.
                      </div>
                    }
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} lg={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {dmtValue === "dmt3" && (
                  <Typography
                    variant="h6"
                    sx={{ ml: 4, mb: -4 }}
                    style={{ color: "#9f86c0" }} // Using style prop as a fallback
                  >
                    Complete Remitter Biometric*
                  </Typography>
                )}

                <Box sx={{ display: "flex", pl: 1, pt: 1, width: "100%" }}>
                  <Box
                    sx={{
                      width: "50%",
                      minWidth: "30%",
                      height: "auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      textAlign: "center", // Align text center for device status
                    }}
                  >
                    {/* Red Dot Indicator */}
                    {rdDevice && (
                      <div
                        style={{
                          background: getColor(rdDevice ? rdDevice.status : ""),
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                        }}
                      ></div>
                    )}
                    {/* Scan Animation */}
                    <span style={{ marginBottom: "12px" }}>
                      {resolveScanImage(scanAnim)}
                    </span>

                    {/* Machine Button Group */}
                    {dmtValue === "dmt2" ? (
                      <MachineButtonGroup
                        onScan={() => {
                          setScanAnim(RDDeviceStatus.SCANNING);
                          CaptureFingerPrintDmt2(
                            rdDevice && rdDevice.rdport,
                            (msg, data) => {
                              console.log("data in remkyc=> ", data);
                              setScanAnim(RDDeviceStatus.SCAN_SUCCESS);
                              setScanData(data);
                            },
                            (err) => {
                              apiErrorToast("Error", JSON.stringify(err));
                              setScanAnim(RDDeviceStatus.SCAN_FAILED);
                            }
                          );
                        }}
                        onRdDeviceInfo={() => {
                          if (getRdDeviceInfo) getRdDeviceInfo();
                        }}
                      />
                    ) : dmtValue === "dmt3" ? (
                      <MachineButtonGroup
                        onScan={() => {
                          setScanAnim(RDDeviceStatus.SCANNING);
                          CaptureFingerPrintDmt2(
                            rdDevice && rdDevice.rdport,
                            (msg, data) => {
                              console.log("data in remkyc=> ", data);
                              setScanAnim(RDDeviceStatus.SCAN_SUCCESS);
                              setScanData(data);
                            },
                            (err) => {
                              apiErrorToast("Error", JSON.stringify(err));
                              setScanAnim(RDDeviceStatus.SCAN_FAILED);
                            }
                          );
                        }}
                        onRdDeviceInfo={() => {
                          if (getRdDeviceInfo) getRdDeviceInfo();
                        }}
                      />
                    ) : (
                      <MachineButtonGroup
                        onScan={() => {
                          setScanAnim(RDDeviceStatus.SCANNING);
                          CaptureFingerPrintDmt1(
                            dynamicWadh,
                            rdDevice && rdDevice.rdport,
                            (msg, data) => {
                              setScanAnim(RDDeviceStatus.SCAN_SUCCESS);
                              setScanData(data);
                            },
                            (err) => {
                              apiErrorToast("Error", JSON.stringify(err));
                              setScanAnim(RDDeviceStatus.SCAN_FAILED);
                            }
                            // dynamicWadh
                          );
                        }}
                        onRdDeviceInfo={() => {
                          if (getRdDeviceInfo) getRdDeviceInfo();
                        }}
                      />
                    )}
                  </Box>

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item md={12} xs={12}>
                      {/* RD Device Search */}
                      <RdDeviceSearch
                        list={rdDeviceList}
                        cb={(item) => {
                          if (item) setRdDevice(item);
                        }}
                        defaultValue={
                          rdDeviceList?.length > 0 && rdDeviceList[0]?.info
                        }
                      />
                      {!machineRequest && rdDeviceList === undefined && (
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "red",
                            textAlign: "left",
                          }}
                        >
                          You do not have any RD Service installed in your
                          system
                        </Typography>
                      )}
                    </Grid>

                    <Grid item md={12} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="Device Status"
                          id="d_status"
                          size="small"
                          value={
                            rdDevice
                              ? rdDevice.status
                              : RDDeviceStatus.NOT_READY
                          }
                          disabled
                          fullWidth
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={12} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="Scan Quality"
                          id="scan_quality"
                          size="small"
                          value={scanData && scanData.score}
                          disabled
                          fullWidth
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                <Typography sx={{ mt: 2 }}>
                  <span style={{ fontWeight: "bold", color: "#DC5F5F" }}>
                    Note:
                  </span>{" "}
                  Connect the scanner for scanning the impression (when the
                  scanner is connected, the dot in the corner will be green).
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default RemitterKyc;

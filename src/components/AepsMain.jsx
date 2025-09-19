import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Grid,
  Tabs,
  Tab,
  Stack,
  TextField,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import AEPS2FAModal from "./AEPS/AEPS2FAModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";

const AepsMainComponent = () => {
  const [aadhaar, setAadhaar] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [aeps2FAOpen, setAeps2FAOpen] = useState(false);
  const [fingerprintData, setFingerprintData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoadingBanks(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.AEPS_BANKS
      ); // your bank list API
      if (response) {
        setBanks(response.data);
      } else {
        showToast("Failed to load banks", "error");
      }
    } catch (err) {
      showToast("Something went wrong while fetching banks", "error");
    } finally {
      setLoadingBanks(false);
    }
  };

  const [formData, setFormData] = useState({
    mobile: "",
    amount: 0,
    bank:"",
     bank_iin: "",
    activeTab: 0,
  });

  const { location } = useContext(AuthContext) || {};
  const { showToast } = useToast() || { showToast: (msg) => alert(msg) };

  const handleTabChange = (e, val) => {
    setActiveTab(val);
    setFormData((prev) => ({ ...prev, activeTab: val }));
  };

  const handleFingerSuccess = (scanData) => {
    setAeps2FAOpen(false);
    // if (!formData.aadhaar || !formData.bank) {
    //   showToast("Fill Aadhaar & Bank first", "error");
    //   return;
    // }
    handleAPICall(scanData);
  };

  const handleAPICall = async (scanData) => {
    setLoading(true);
    const payload = {
      AadhaarNumber: aadhaar,
      BankName: formData.bank,
      bank_iin: formData.bank_iin,
      number: formData.mobile,
      pidData: scanData.pidData || scanData.pid,
      pidDataType: scanData.pidDataType || scanData.type,
      ci: scanData.ci || scanData.cI,
      dc: scanData.dc || scanData.dC,
      dpId: scanData.dpId || scanData.dpID,
      fCount: scanData.fCount,
      hmac: scanData.hmac || scanData.hMac,
      mc: scanData.mc || scanData.mC,
      errInfo: scanData.errInfo,
      mi: scanData.mi || scanData.mI,
      nmPoints: scanData.nmPoints,
      qScore: scanData.qScore,
      rdsId: scanData.rdsId,
      rdsVer: scanData.rdsVer,
      sessionKey: scanData.sessionKey,
      srno: scanData.srno,
        operator: activeTab === 0 ? 50 : 49,
      latitude: location?.lat || 0,
      longitude: location?.long || 0,
      amount: formData.amount,
       pf: "web", 
      type:
        activeTab === 0
          ? "CASH_WITHDRAWAL"
          : activeTab === 1
          ? "BALANCE_ENQUIRY"
          : "MINI_STATEMENT",
    };

    let endpoint =
      activeTab === 0
        ? ApiEndpoints.AEPS_CASHWITHDRAWAL
        : activeTab === 1
        ? ApiEndpoints.AEPS_BALANCE_ENQUIRY
        : ApiEndpoints.AEPS_MINI_STATEMENT;

    try {
      const { error, response } = await apiCall("post", endpoint, payload);
      if (error) showToast(error?.message, "error");
      else {
        const resp = response?.data;
        showToast(
          resp?.message || "Success",
          resp?.status ? "success" : "error"
        );
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{}}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          // mb: 1,
          "& .MuiTabs-indicator": {
            height: "4px",
            borderRadius: "4px",
            background: "linear-gradient(135deg,#9d72f0,#7b4dff)",
          },
        }}
      >
        <Tab label="Cash Withdrawal" />
        <Tab label="Balance Enquiry" />
        <Tab label="Mini Statement" />
      </Tabs>

      <AEPS2FAModal
        open={aeps2FAOpen}
        onClose={() => setAeps2FAOpen(false)}
        title="AEPS"
        formData={formData}
        setFormData={setFormData}
        onFingerSuccess={handleFingerSuccess}
        banks={banks}
        aadhaar={aadhaar}
        fingerData={setFingerprintData}
        setAadhaar={setAadhaar}
      />
    </Box>
  );
};
export default AepsMainComponent;

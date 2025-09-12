import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import DmtTxn from "../components/Transactions/DmtTxn";
import BbpxTxn from "../components/Transactions/BbpsTxn";
import AepsTxn from "../components/Transactions/AepsTxn";
import RechargeTxn from "../components/Transactions/RechargeTxn";
import PayoutTxn from "../components/Transactions/PayoutTxn";
import MatmTxn from "../components/Transactions/MatmTxn";
import IrctcTxn from "../components/Transactions/IrctcTxn";

// icons
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"; // DMT
import ReceiptIcon from "@mui/icons-material/Receipt";     // BBPS
import FingerprintIcon from "@mui/icons-material/Fingerprint"; // AEPS
import CreditCardIcon from "@mui/icons-material/CreditCard"; // Matm
import PaymentIcon from "@mui/icons-material/Payment";    // Payout
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone"; // Recharge
import TrainIcon from "@mui/icons-material/Train";        // IRCTC

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

export const Transaction = () => {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Custom Styled Tabs */}
     <Box
  sx={{
    bgcolor: "white",
    borderRadius: "0 0 24px 24px", // ✅ only bottom corners curved
    display: "flex",
    p: 1,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "fit-content",
    mx: "auto",
    mt: -3,
  }}
>
  <Tabs
    value={tab}
    onChange={handleChange}
    variant="scrollable"
    scrollButtons="auto"
    TabIndicatorProps={{ style: { display: "none" } }}
    sx={{
      "& .MuiTab-root": {
        minWidth: 180,
        borderRadius: "16px",
        textTransform: "none",
        fontSize: "0.75rem",
        color: "#1976d2",
        display: "flex",
        flexDirection: "column",
        padding: "8px 12px",
      },
      "& .Mui-selected": {
        bgcolor: "#e3f2fd",
        color: "#1976d2",
        fontWeight: "bold",
      },
    }}
  >
    <Tab icon={<SwapHorizIcon />} label="DMT" />
    <Tab icon={<ReceiptIcon />} label="BBPS" />
    <Tab icon={<FingerprintIcon />} label="Aeps" />
    <Tab icon={<CreditCardIcon />} label="Matm" />
    <Tab icon={<PaymentIcon />} label="Payout" />
    <Tab icon={<PhoneIphoneIcon />} label="Recharge" />
    <Tab icon={<TrainIcon />} label="Irctc" />
  </Tabs>
</Box>


      {/* Tab Panels */}
      <TabPanel value={tab} index={0}>
        <DmtTxn />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <BbpxTxn />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <AepsTxn />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <MatmTxn />
      </TabPanel>
      <TabPanel value={tab} index={4}>
        <PayoutTxn />
      </TabPanel>
      <TabPanel value={tab} index={5}>
        <RechargeTxn />
      </TabPanel>
      <TabPanel value={tab} index={6}>
        <IrctcTxn />
      </TabPanel>
    </Box>
  );
};

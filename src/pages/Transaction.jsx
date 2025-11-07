import React, { useContext, useState } from "react";
import CommonTabs from "../components/common/CommonTabs";

// Import your transaction components
import DmtTxn from "../components/Transactions/DmtTxn";
import BbpxTxn from "../components/Transactions/BbpsTxn";
import AepsTxn from "../components/Transactions/AepsTxn";
import RechargeTxn from "../components/Transactions/RechargeTxn";
import PayoutTxn from "../components/Transactions/PayoutTxn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
// Icons
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import TrainIcon from "@mui/icons-material/Train";
import { Wallet } from "@mui/icons-material";
import Wallet2WalletTransfer from "./Wallet2WalletTransfer";
import CreditCardTxn from "../components/Transactions/CreditCardTxn";
import AllTranscation from "./AllTranscation";
import AuthContext from "../contexts/AuthContext";

export const Transaction = () => {
 const [tab, setTab] = useState(0);
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };


  const tabItems = [
    ...(user?.role === "adm" || user?.role === "sadm" ? [
     {
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "80px",
            justifyContent: "flex-start",
          }}
        >
          <SwapHorizIcon fontSize="small" />
          <span>All Txns</span>
        </div>
      ),
      component: <AllTranscation />,
    },
    ] : []),
    {
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "80px",
            justifyContent: "flex-start",
          }}
        >
          <SwapHorizIcon fontSize="small" />
          <span>Fund Transfer</span>
        </div>
      ),
      component: <PayoutTxn />,
    },
    {
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "80px",
            justifyContent: "flex-start",
          }}
        >
          <CurrencyRupeeIcon fontSize="small" />
          <span>DMT</span>
        </div>
      ),
      component: <DmtTxn />,
    },
    {
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "80px",
            justifyContent: "flex-start",
          }}
        >
          <FingerprintIcon fontSize="small" />
          <span>Aeps</span>
        </div>
      ),
      component: <AepsTxn />,
    },
    {
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "80px",
            justifyContent: "flex-start",
          }}
        >
          <ReceiptIcon fontSize="small" />
          <span>BBPS</span>
        </div>
      ),
      component: <BbpxTxn />,
    },

    {
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "80px",
            justifyContent: "flex-start",
          }}
        >
          <PhoneIphoneIcon fontSize="small" />
          <span>Recharge</span>
        </div>
      ),
      component: <RechargeTxn />,
    },
    {
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Wallet fontSize="small" />
          Credit Card
        </div>
      ),
      component: <CreditCardTxn />,
    },

    {
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "80px",
            justifyContent: "flex-start",
          }}
        >
          <Wallet fontSize="small" />
          <span>W2W</span>
        </div>
      ),
      component: <Wallet2WalletTransfer />,
    },
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};

import { useMemo, useCallback, useContext, useEffect, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";

import { RemoveRedEye, Wallet } from "@mui/icons-material";
import CommonLoader from "../components/common/CommonLoader";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import WalletTxnData from "../components/WalletTxnData";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import { capitalize1 } from "../utils/TextUtil";
import CommonTabs from "../components/common/CommonTabs";
import WhiteListedAccount from "./WhiteListedAccount";
import BlackListedAccount from "./BlackListedAccount";
import LeanAmount from "./LeanAmount";


export const Risk = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const allTabs = [
    {
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Wallet fontSize="small" />
          White Listed Account
        </div>
      ),
      content: <WhiteListedAccount />,
      roles: ["adm", "sadm"], 
    },
    {
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Wallet fontSize="small" />
          Black Listed Account
        </div>
      ),
      content: <BlackListedAccount />,
      roles: ["adm", "sadm"],
    },
    {
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Wallet fontSize="small" />
          Lien Amount
        </div>
      ),
      content: <LeanAmount/>,
      roles: ["adm", "sadm", "ret", "dd", "api"], // everyone
    },
  ];

  // filter tabs based on user role
  const tabItems = allTabs.filter((tab) =>
    tab.roles.includes(user?.role)
  );

  return (
    <Box sx={{ width: "100%" }}>
      <CommonTabs tabs={tabItems} value={tab} onChange={handleChange} />
    </Box>
  );
};

export default Risk;

import { Grid } from "@mui/material";
import React, { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import DashboardDataComponent1 from "./DashboardDataComponent1";

const AdminWalletBalanceComponent = ({ graphDuration }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  // Hardcoded balances
  const walletData = [
    { name: "Primary", balance: "12000", color: "#00BF78" },
    { name: "Tertiary", balance: "5000", color: "#9f86c0" },
    { name: "Wallet Balance", balance: "20000", color: "#DC5F5F" },
    { name: "Bank Balance", balance: "15000", color: "#F08D17" },
    { name: "API Balances", balance: "10000", color: "#FFB6C6" },
  ];

  const walletDataAsm = [
    { name: "Primary", balance: "12000", color: "#00BF78" },
    { name: "Tertiary", balance: "5000", color: "#9f86c0" },
  ];

  const [w1] = useState(6000);
  const [w2] = useState(14000);

  return (
    <Grid
      container
      spacing={2} // ✅ spacing instead of overriding flex
      sx={{
        mt: { md: 1, lg: 0, xs: 1 },
        mr: { md: 1, lg: 0, xs: 1 },
      }}
    >
      {[
        { name: "Wallet Balance", balance: 25000000, color: "#1976d2" },
        { name: "Bank Balance", balance: 12000000, color: "#388e3c" },
        { name: "API Balances", balance: 5000000, color: "#f57c00" },
        { name: "Primary", balance: 8000000, color: "#7b1fa2" },
        { name: "Tertiary", balance: 3000000, color: "#d32f2f" },
      ].map((item, index, arr) => (
        <Grid key={index} item xs={6} sm={4} md={2}>
          <DashboardDataComponent1
            users={item}
            data="wallet"
            index={index}
            len={arr.length}
          />
        </Grid>
      ))}

      {/* {user && (user.role === "asm" || user.role === "zsm")
        ? walletDataAsm.map((item, index) => (
            <Grid key={index} item xs={6} sm={4} md={3}>
              <DashboardDataComponent1
                users={item}
                data="wallet"
                index={index}
                len={walletDataAsm.length}
                w1={w1}
                w2={w2}
              />
            </Grid>
          ))
        : walletData.map((item, index) => (
            <Grid key={index} item xs={6} sm={4} md={2}>
              <DashboardDataComponent1
                users={item}
                data="wallet"
                index={index}
                len={walletData.length}
                w1={w1}
                w2={w2}
              />
            </Grid>
          ))} */}
    </Grid>
  );
};

export default AdminWalletBalanceComponent;

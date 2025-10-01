import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  AccountBalanceWallet,
} from "@mui/icons-material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';



const WalletCard = ({
  label = "",
  amount = "",
  icon = <AccountBalanceIcon   />,
  trend = "up",
}) => {
  return (
   <Box
  sx={{
    px: 2,
    py: 1.5,
    borderRadius: 3,
    background: "linear-gradient(135deg, #13c3c1, #6c4bc7)",
    backgroundSize: "200% 200%",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,
    border: "2px solid #13c3c1",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "all 0.4s ease",
    width: "auto",
    maxWidth: "100%",
    backdropFilter: "blur(8px)",
    animation: "gradientShift 6s ease infinite",
    "&:hover": {
      transform: "scale(1.03)",
      boxShadow: "0 14px 35px rgba(0,0,0,0.3)",
      backgroundPosition: "right center",
    },
  }}
>
      {/* Left: Icon */}
      <Avatar
        sx={{
          bgcolor: "#2275b7",
          width: 22,
          height: 22,
        }}
      >
        {icon}
      </Avatar>

      {/* Middle: Text */}
      <Box sx={{ ml: 1 }}>
        <Typography
          sx={{
            fontSize: "1.2rem", // overall font size
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#fff",
          }}
        >
          <span style={{ fontSize: "1.4rem", fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>{amount}</span>
        </Typography>
      </Box>

      {/* <Typography
          sx={{
            fontSize: "1.2rem", // amount font size
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#fff",
          }}
        ></Typography> */}
      {/* </Box> */}

      {/* Right: Trend Icon */}
      {/* <Avatar
        sx={{
          bgcolor: trend === "up" ? "rgba(40, 180, 99, 0.85)" : "rgba(219, 68, 55, 0.85)",
          width: 28,
          height: 28,
        }}
      >
        {trend === "up" ? <ArrowUpward sx={{ fontSize: 18, color: "#fff" }} /> : <ArrowDownward sx={{ fontSize: 18, color: "#fff" }} />}
      </Avatar> */}

      {/* Gradient Animation Keyframes */}
      
      <style>
{`
  @keyframes gradientShift {
    0% { background-position: left center; }
    50% { background-position: right center; }
    100% { background-position: left center; }
  }
`}
</style>
    </Box>
  );
};

export default WalletCard;

import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
// import { getUserColor } from "../theme/setThemeColor";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import Tooltip from "@mui/material/Tooltip";
const DashboardDataComponent2 = ({ users }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
        borderRadius: "10px",
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
        width: "100%",
        mb: { md: 0, sm: 2, xs: 2 },
        flexDirection: { xs: "row", sm: "row" },
        gap: { xs: 2, sm: 0 },
      }}
    >
      <Avatar
        sx={{
          width: { xs: 40, sm: 48 },
          height: { xs: 40, sm: 48 },
          mr: { xs: 0, sm: 1.5 },
          mb: { xs: 1, sm: 0 },
          // backgroundColor: "#000"(users.role),
        }}
      >
        {users.icon}
      </Avatar>

      <Box
        sx={{
          textAlign: { xs: "center", sm: "left" },
          maxWidth: { xs: "100%", sm: "150px" },
          mb: { xs: 1, sm: 0 },
        }}
      >
        <Typography
          sx={{
            color: "grey",
            fontSize: { xs: "12px", sm: "14px" },
          }}
        >
          {users.role === "Asm" ? (
            <Tooltip title="Area Sales Manager" placement="top">
              <Typography>ASM</Typography>
            </Tooltip>
          ) : users.role === "ZSM" ? (
            <Tooltip title="Zonal Sales Manager" placement="top">
              <Typography>ZSM</Typography>
            </Tooltip>
          ) : users.role === "Ad" ? (
            <Tooltip title="Area Distributors" placement="top">
              <Typography>Ad</Typography>
            </Tooltip>
          ) : users.role === "Md" ? (
            <Tooltip title="Master Distributors" placement="top">
              <Typography>Md</Typography>
            </Tooltip>
          ) : users.role === "Ret" ? (
            "Retailers"
          ) : users.role === "Dd" ? (
            <Tooltip title="Direct Dealer" placement="top">
              <Typography>Dd</Typography>
            </Tooltip>
          ) : users.role === "Api" ? (
            "API"
          ) : (
            ""
          )}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "16px", sm: "18px" },
            fontWeight: "bold",
            display: { xs: "none", sm: "block" },
          }}
        >
          {users.userCount ?? 0}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{
          fontSize: "12px",
          color: users.increased ? "#00BF78" : "#DC5F5F",
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
          mt: { xs: 1, sm: 0 },
          width: { xs: "100%", sm: "auto" },
        }}
      >
        {users.increased ? (
          <NorthIcon sx={{ ml: -0.8, fontSize: { xs: "14px", sm: "16px" } }} />
        ) : (
          <SouthIcon sx={{ ml: -0.8, fontSize: { xs: "14px", sm: "18px" } }} />
        )}
        <Typography sx={{ fontSize: { xs: "10px", sm: "12px" }, ml: 0.5 }}>
          54.3%
        </Typography>
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          display: { xs: "block", sm: "none" },
          mt: { xs: 1, sm: 0 },
        }}
      >
        {users.userCount ?? 0}
      </Typography>
    </Box>
  );
};

export default DashboardDataComponent2;

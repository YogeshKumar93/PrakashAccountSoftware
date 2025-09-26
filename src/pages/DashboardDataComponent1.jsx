import React, { useState } from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Box, Grid, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const DashboardDataComponent1 = ({ users, data, index, len }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        borderRight: {
          lg:
            data === "txn" ? "" : index === len - 1 ? "" : "1px solid #DADADA",
          md:
            data === "txn" ? "" : index === len - 1 ? "" : "1px solid #DADADA",
        },
      }}
    >
      <Grid item>
        <div style={{ fontSize: data === "txn" ? "15px" : "" }}>
          {users.name}
          {data !== "txn" && <RefreshIcon sx={{ fontSize: "16px", ml: 0.5 }} />}
        </div>

        <div
          style={{ display: "flex", alignItems: "center" }}
          onClick={(e) => {
            if (users.name === "API Balances") handleMenu(e);
          }}
        >
          <BarChartIcon sx={{ mr: 1, color: users.color }} />
          <Tooltip title={users.balance.toLocaleString("en-IN") + " ₹"}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
              }}
            >
              <Typography sx={{ fontSize: data === "txn" ? "18px" : "24px" }}>
                {(users.balance / 10000000).toFixed(2)}
              </Typography>
              {data !== "txn" && (
                <div style={{ marginLeft: "2px", fontSize: "12px" }}>Cr</div>
              )}
            </div>
          </Tooltip>
        </div>

        {/* Example hardcoded menu only for API balances */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>Bank A</span>
              <span>₹5,00,000</span>
            </Box>
          </MenuItem>
          <MenuItem>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>Bank B</span>
              <span>₹3,50,000</span>
            </Box>
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
};

export default DashboardDataComponent1;

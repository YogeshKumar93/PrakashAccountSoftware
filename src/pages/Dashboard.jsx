import React, { useState, useEffect } from "react";

import { useContext } from "react";
import CheckIcon from "@mui/icons-material/Check";
import BarChartIcon from "@mui/icons-material/BarChart";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import AdminDashboard from "./AdminDashboard";
import AuthContext from "../contexts/AuthContext";
import {
  Box,
  Card,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import BarGraphIcon from "../assets/dashboard_icons/Graph 3.png";
import PendingGraphIcon from "../assets/dashboard_icons/Graph 5.png";
import FailedGraphIcon from "../assets/dashboard_icons/Graph 4.png";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import {
  AccountCircle,
  AdminPanelSettings,
  CorporateFare,
  Devices,
  Engineering,
  Group,
  SupervisorAccount,
} from "@mui/icons-material";

const Dashboard = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [request, setRequest] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingDashboard2, setLoadingDashboard2] = useState(null);
  const [dashboardData2, setDashboardData2] = useState(true);

  const cardStyle = {
    p: 3,
    width: "100%",
    borderRadius: 2,
    background: "white",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  };
  useEffect(() => {
    const fetchDashboard2 = async () => {
      setLoadingDashboard2(true);
      try {
        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.GET_DASHBOARD2
        );

        if (response) {
          setDashboardData2(response);
          console.log("Dashboard2 data:", response);
        } else {
          console.error("Dashboard2 API error:", error);
        }
      } catch (err) {
        console.error("Dashboard2 fetch failed:", err);
      } finally {
        setLoadingDashboard2(false);
      }
    };

    fetchDashboard2();
  }, []);
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoadingDashboard(true);
      try {
        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.GET_DASHBOARD1
        );

        if (response) {
          setDashboardData(response);
          console.log("Dashboard data:", response);
        } else {
          console.error("Dashboard API error:", error);
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchDashboard();
  }, []); // empty dependency array = runs once on mount

  console.log("dashboardData2", dashboardData2);
  const [userData, setUserData] = useState([
    {
      role: "ZSM",
      userCount: "0",
      icon: <InterpreterModeIcon />,
      color: "#4045A1",
      increased: "53%",
    },
    {
      role: "Asm",
      userCount: "0",
      icon: <InterpreterModeIcon />,
      color: "#4045A1",
      increased: "53%",
    },
    {
      role: "Md",
      userCount: "0",
      icon: <GroupAddIcon />,
      color: "#DC5F5F",
      decreased: "12%",
    },
    {
      role: "Ad",
      userCount: "0",
      icon: <GroupAddIcon />,
      color: "#DC5F5F",
      decreased: "12%",
    },
    {
      role: "Dd",
      icon: <RecordVoiceOverIcon />,
      userCount: "0",
      color: "#4045A1",
      decreased: "1%",
    },
    {
      role: "Ret",
      userCount: "0",
      icon: <SupervisorAccountIcon />,
      color: "#00BF78",
      increased: "3%",
    },

    {
      role: "Api",
      icon: <PersonAddIcon />,
      userCount: "0",
      color: "#ff9800",
      decreased: "1%",
    },
  ]);
  const [graphRequest, setGraphRequest] = useState(false);

  const [txnDataReq, setTxnDataReq] = useState(false);
  const serviceData = dashboardData2?.data
    ? Object.entries(dashboardData2.data).map(([service, stats]) => ({
        service: service.toUpperCase(),
        totalTxns: stats.total_txns ?? 0,
        totalAmount: stats.total_amount ?? "0.00",
        tdAmount: stats.td_amount ?? "0.00",
        tdCount: stats.td_count ?? 0,
        mtdAmount: stats.mtd_amount ?? "0.00",
        mtdCount: stats.mtd_count ?? 0,
        lmtdAmount: stats.lmtd_amount ?? "0.00",
        lmtdCount: stats.lmtd_count ?? 0,
      }))
    : [];
  const [txnData, setTxnData] = useState([
    {
      name: "TOTAL",
      balance: "0",
      percent: "100",
      icon: <BarChartIcon sx={{ fontSize: "16px" }} />,
      color: "rgb(153, 102, 255)",
      bgColor: "rgb(153, 102, 255 , 0.090)",
    },
    {
      name: "SUCCESS",
      balance: "0",
      percent: "0",
      icon: <CheckIcon sx={{ fontSize: "16px" }} />,
      color: " rgb(75, 192, 192)",
      bgColor: "rgb(75, 192, 192 , 0.090)",
      circleColor: "#DAF2F2",
      image: BarGraphIcon,
    },
    {
      name: "PENDING",
      balance: "0",
      percent: "0",
      icon: <PriorityHighOutlinedIcon sx={{ fontSize: "16px" }} />,
      color: "rgba(255, 204, 86)",
      bgColor: "rgb(255, 204, 86 , 0.090)",
      circleColor: "#FFF5DC",
      image: PendingGraphIcon,
    },
    {
      name: "FAILED",
      balance: "0",
      percent: "0",
      icon: <CloseOutlinedIcon sx={{ fontSize: "16px" }} />,
      color: "rgba(255, 99, 133)",
      bgColor: "rgb(255, 99, 133 , 0.090)",
      circleColor: "#FFE0E6",
      image: FailedGraphIcon,
    },
  ]);
  const roleIcons = {
    ret: <Group sx={{ color: "#4f46e5" }} />,
    asm: <SupervisorAccount sx={{ color: "#16a34a" }} />,
    md: <CorporateFare sx={{ color: "#f97316" }} />,
    ad: <Engineering sx={{ color: "#dc2626" }} />,
    dd: <SupervisorAccount sx={{ color: "#0891b2" }} />,
    api: <Devices sx={{ color: "#9333ea" }} />,
    admin: <AdminPanelSettings sx={{ color: "#eab308" }} />,
    zsm: <AccountCircle sx={{ color: "#2563eb" }} />,
    di: <AccountCircle sx={{ color: "#1d4ed8" }} />, // Add more roles as needed
  };
  const userStatsDynamic = dashboardData?.data?.map((roleItem) => {
    const role = roleItem.role.toLowerCase();
    return {
      type:
        role === "ret"
          ? "Retailers"
          : role === "adm"
          ? "Admin"
          : role === "md"
          ? "Master Distributor"
          : role === "ad"
          ? "Area Distributor"
          : role === "dd"
          ? "Direct Dealer"
          : role === "api"
          ? "API"
          : role === "asm"
          ? "Area Sales Manafer"
          : role === "zsm"
          ? "Zonal Sales Manager"
          : role === "di"
          ? "Distributor"
          : role.toUpperCase(),
      count: roleItem.total_users.toLocaleString(),
      icon: roleIcons[role] || <AccountCircle />,
      change: "+0%", // calculate dynamically if available
      walletBalance: roleItem.total_w1, // existing
      w1: (roleItem.total_w1 / 100).toLocaleString(), // added
      w2: (roleItem.total_w2 / 100).toLocaleString(), // added
    };
  });
  return (
    <>
      <Grid container spacing={2} mb={4}>
        {/* Service-wise Transaction Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Service-wise Transaction Summary
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                maxHeight: 400,
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Service
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      LMTD Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      MTD Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Today's Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Total Txns
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingDashboard2 ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    serviceData?.map((item, i) => (
                      <TableRow
                        key={i}
                        hover
                        sx={{ "&:hover": { bgcolor: "#f9fafb" } }}
                      >
                        <TableCell>{item.service}</TableCell>
                        <TableCell>
                          ₹{item.lmtdAmount}({item.lmtdCount})
                        </TableCell>

                        <TableCell>
                          ₹{item.mtdAmount}({item.mtdCount})
                        </TableCell>
                        <TableCell>
                          ₹{item.tdAmount}({item.tdCount})
                        </TableCell>

                        <TableCell>{item.totalTxns}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              User Table
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                maxHeight: 360,
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Total Users
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Wallet 1
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Wallet 2
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Wallet 3
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingDashboard ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    userStatsDynamic?.map((stat, i) => (
                      <TableRow
                        key={i}
                        hover
                        sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box sx={{ mr: 1 }}>{stat.icon}</Box>
                            {stat.type}
                          </Box>
                        </TableCell>
                        <TableCell>{stat.count}</TableCell>
                        <TableCell>{stat.w1 || 0}</TableCell>
                        <TableCell>{stat.w2 || 0}</TableCell>
                        <TableCell>{stat.w3 || 0}</TableCell>
                        <TableCell>
                          {/* Add only if role matches "dd" */}
                          {stat.type === "dd"
                            ? Number(stat.w1 || 0) +
                              Number(stat.w2 || 0) +
                              Number(stat.w3 || 0)
                            : Number(stat.w1 || 0) +
                              Number(stat.w2 || 0) +
                              Number(stat.w3 || 0)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;

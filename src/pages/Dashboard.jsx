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
import { Typography } from "@mui/material";
import BarGraphIcon from "../assets/dashboard_icons/Graph 3.png";
import PendingGraphIcon from "../assets/dashboard_icons/Graph 5.png";
import FailedGraphIcon from "../assets/dashboard_icons/Graph 4.png";

const Dashboard = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [request, setRequest] = useState(false);
  const [graphDuration, setGraphDuration] = useState("TODAY");
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
  return (
    <>
      <AdminDashboard
        graphDuration={graphDuration}
        setGraphDuration={setGraphDuration}
        user={user}
        request={request}
        userData={userData}
        graphRequest={graphRequest}
        setGraphRequest={setGraphRequest}
        // getTxnData={getTxnData}
        txnDataReq={txnDataReq}
        txnData={txnData}
      />
    </>
  );
};

export default Dashboard;

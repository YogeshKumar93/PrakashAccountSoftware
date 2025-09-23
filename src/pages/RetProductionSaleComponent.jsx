import React from "react";
import {
  FormControlLabel,
  Grid,
  LinearProgress,
  Switch,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import { currencySetter } from "../utils/Currencyutil";
import CheckIcon from "@mui/icons-material/Check";
import BarChartIcon from "@mui/icons-material/BarChart";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Mount from "./Mount";
import TodayThisLastComponent from "./TodayThisLastComponent";
import MyEarnings from "./MyEarnings";
import DataComponent from "./DataComponent";
import BarGraphIcon from "../assets/dashboard_icons/Graph 3.png";
import PendingGraphIcon from "../assets/dashboard_icons/Graph 5.png";
import FailedGraphIcon from "../assets/dashboard_icons/Graph 4.png";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
const RetProductionSaleComponent = ({ role, USER_ROLES }) => {
  const [txnDataReq, setTxnDataReq] = useState(false);
  const [txnDataDuration, setTxnDataDuration] = useState("TODAY");
  const [apiData, setApiData] = useState([]);
  const [showProductTable, setShowProductTable] = useState(true);
  const [query, setQuery] = useState();
  const [commonSearchTime, setCommonSearchTime] = useState("today");
  const handleChange = (event, newValue) => {
    if (process.env.REACT_APP_TITLE === "ImpsGuru")
      setTxnDataDuration(newValue);
    else setTxnDataDuration(event);
  };

  const [txnData, setTxnData] = useState([
    {
      name: "TOTAL",
      balance: "0",
      percent: "0",
      icon: <BarChartIcon sx={{ fontSize: "16px" }} />,
      color: "rgb(153, 102, 255)",
      bgColor: "rgb(153, 102, 255 , 0.20)",
      circleColor: "#e74c3c",
    },
    {
      name: "SUCCESS",
      balance: "0",
      percent: "0",
      icon: <CheckIcon sx={{ fontSize: "16px" }} />,
      color: " rgb(75, 192, 192)",
      bgColor: "rgb(75, 192, 192 , 0.20)",
      circleColor: "#DAF2F2",
      image: BarGraphIcon,
    },
    {
      name: "PENDING",
      balance: "0",
      percent: "0",
      icon: <PriorityHighOutlinedIcon sx={{ fontSize: "16px" }} />,
      color: "rgba(255, 204, 86)",
      bgColor: "rgb(255, 204, 86 , 0.20)",
      circleColor: "#FFF5DC",
      image: PendingGraphIcon,
    },
    {
      name: "FAILED",
      balance: "0",
      percent: "0",
      icon: <CloseOutlinedIcon sx={{ fontSize: "16px" }} />,
      color: "rgba(255, 99, 133)",
      bgColor: "rgb(255, 99, 133 , 0.20)",
      circleColor: "#FFE0E6",
      image: FailedGraphIcon,
    },
  ]);

  const columns = [
    {
      name: "Services",
      selector: (row) => (
        <Typography sx={{ fontSize: "12px" }}>{row.service}</Typography>
      ),
    },
    {
      name: "Last Month",
      selector: (row) => (
        <Typography sx={{ fontSize: "12px" }}>
          {currencySetter(row.Last)}
        </Typography>
      ),
    },

    {
      name: "This Month",
      selector: (row) => (
        <Typography sx={{ fontSize: "12px" }}>
          {" "}
          {currencySetter(row.This)}
        </Typography>
      ),
    },
    {
      name: "Today",
      selector: (row) => (
        <Typography sx={{ fontSize: "12px" }}>
          {" "}
          {currencySetter(row.Today)}
        </Typography>
      ),
    },

    {
      name: "Achieved",
      selector: (row) => (
        <div style={{ width: "100px", fontSize: "12px" }}>
          <div>
            {Number(row.Last) === 0
              ? "0.00%"
              : Number((parseInt(row.This) * 100) / parseInt(row.Last)).toFixed(
                  2
                ) + "%"}
          </div>
          <div>
            <LinearProgress
              variant="determinate"
              value={
                Number((parseInt(row.This) * 100) / parseInt(row.Last)) > 100
                  ? 100
                  : Number(row.Last) === 0
                  ? 0
                  : Number((parseInt(row.This) * 100) / parseInt(row.Last))
              }
            />
          </div>
        </div>
      ),
    },
  ];
  console.log("role is ", role);

  return (
    <>
      {/* <HtmlRenderer data={"jhdhcv"}/> */}
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          // background: "#FAF9F6",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          p: 1, // Padding for the container
        }}
      >
        {/* Full-Width Grid */}
        <Grid
          item
          xs={12}
          md={12}
          sm={12}
          lg={12}
          // sx={{
          //   width: "100%",
          //   height: "auto",
          // }}
        >
          <TodayThisLastComponent
            txnDataDuration={txnDataDuration}
            txnDataReq={txnDataReq}
            txnData={txnData}
            // getTxnData={getTxnData}
            handleChange={handleChange}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={0}
        sx={{
          p: 1,
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          sx={{
            background: "#fff",
            borderRadius: "8px",
            boxShadow:
              "rgba(0, 0, 0, 0.05) 0px 6px 24px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            p: 1.3, // Padding inside the card
            height: "auto",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              mb: 1, // Add margin bottom for spacing
            }}
          >
            Product Sale
            <CachedOutlinedIcon
              className="ms-2 refresh-purple"
              sx={{ ml: 2, cursor: "pointer", fontSize: "18px" }}
              onClick={() => refreshFunc(setQuery)}
            />
          </Typography>
          <div
            style={{
              height: role === "Api" ? "500px" : "300px",
              overflowY: "auto",
            }}
          >
            {/* <ApiPaginate
              apiEnd={ApiEndpoints.GET_RET_PROD_SALE}
              columns={columns}
              apiData={apiData}
              tableStyle={CustomStyles}
              setApiData={setApiData}
              ExpandedComponent=""
              queryParam={query || ""}
              returnRefetch={(ref) => {
                refresh = ref;
              }}
              paginate={false}
            /> */}
          </div>
        </Grid>

        <Grid
          container
          sx={{
            mt: 1.5,
            ml: 0.1,
            gap: 1.6,
          }}
        >
          {role !== "Acc" && role !== "Api" && role !== "Asm" && (
            <Grid
              item
              xs={12}
              sm={12}
              md={5.9}
              lg={5.9}
              sx={{
                background: "#fff",
                borderRadius: "8px",
                boxShadow:
                  "rgba(0, 0, 0, 0.05) 0px 6px 24px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                p: 2,
                height: "auto",
              }}
            >
              <Mount
                visible={
                  role !== USER_ROLES.ASM &&
                  role !== USER_ROLES.ACC &&
                  role !== USER_ROLES.API
                }
              >
                <MyEarnings
                  txnDataDuration={txnDataDuration}
                  handleChange={handleChange}
                />
              </Mount>
            </Grid>
          )}

          {/* DataComponent Section */}
          {role !== "Api" && (
            <Grid
              item
              xs={12}
              sm={12}
              md={5.9}
              lg={5.9}
              sx={{
                background: "#fff",
                borderRadius: "8px",
                boxShadow:
                  "rgba(0, 0, 0, 0.05) 0px 6px 24px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                p: 2,
                height: "auto",
              }}
            >
              <DataComponent />
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* <RightNavbar/> */}
      {/* transactions card component */}
    </>
  );
};

export default RetProductionSaleComponent;

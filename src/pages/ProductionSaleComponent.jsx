import {
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  LinearProgress,
  Switch,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import { useContext } from "react";
import AdminBarChart from "./AdminBarChart";
import MonthlyDataChart from "./MonthlyDataChart";
// import Spinner from "./loading-screen/Spinner";
import DashboardDataComponent1 from "./DashboardDataComponent1";
import AuthContext from "../contexts/AuthContext";
import LineChartAllServices from "./LineChartAllServices.";
import AdminLineChart from "./AdminLineChart";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
const ProductionSaleComponent = ({
  graphDuration,
  graphRequest,
  setGraphRequest,
  isPaisaKart = false,
}) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [graphData, setGraphData] = useState([]);
  const [graphAllData, setGraphAllData] = useState();
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const [txnDataReq, setTxnDataReq] = useState(false);
  const [showAllGraph, setShowAllGraph] = useState(false);
  const [showMonthlyData, setShowMonthlyData] = useState(false);

  const [showProductTable, setShowProductTable] = useState(
    user && (user.role === "Asm" || user.role === "Zsm") ? true : false
  );
  const [isMonthlyData, setIsMonthlyData] = useState(false);
  const [txnData, setTxnData] = useState([
    {
      name: "TOTAL",
      balance: "0",
      color: "#9f86c0",
    },
    {
      name: "SUCCESS",
      balance: "0",
      color: "#00BF78",
    },
    {
      name: "PENDING",
      balance: "0",
      color: "#F08D17",
    },
    {
      name: "FAILED",
      balance: "0",
      color: "#DC5F5F",
    },
  ]);

  const columnsProd = [
    {
      name: "Services",
      selector: (row) => row.service,
    },
    {
      name: "Last Month",
      selector: (row) => Number(row.Last).toFixed(2),
    },

    {
      name: "This Month",
      selector: (row) => Number(row.This).toFixed(2),
    },
    {
      name: "Today",
      selector: (row) => Number(row.Today).toFixed(2),
    },

    {
      name: "Achieved",
      selector: (row) => (
        <div style={{ width: "100px" }}>
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
  const handleToggleChange = (event) => {
    setShowMonthlyData(event.target.checked);
  };

  // const getGraphData = () => {
  //   postJsonData(
  //     ApiEndpoints.ADMIN_DASHBOARD_GET_GRAPH_DATA,
  //     {
  //       type: graphDuration,
  //     },
  //     setGraphRequest,
  //     (res) => {
  //       const data = res.data.data;
  //       if (graphDuration === "TODAY") {
  //         setGraphData(barChartData(data));
  //       } else if (graphDuration === "THIS" || graphDuration === "LAST") {
  //         setGraphAllData(data && data);
  //         setGraphData(totalChartData(data));
  //       }
  //     },
  //     (err) => {
  //       apiErrorToast(err);
  //     }
  //   );
  // };

  // const getTxnData = () => {
  //   postJsonData(
  //     ApiEndpoints.ADMIN_DASHBOARD_GET_TXN_DATA,
  //     {
  //       type: graphDuration,
  //     },
  //     setTxnDataReq,
  //     (res) => {
  //       const data = res.data.data;
  //       const newData = [...txnData];
  //       newData.forEach((oldData) => {
  //         if (oldData.name === "SUCCESS") {
  //           oldData.balance = data.SUCCESS;
  //         }
  //         if (oldData.name === "PENDING") {
  //           oldData.balance = data.PENDING;
  //         }
  //         if (oldData.name === "FAILED") {
  //           oldData.balance = data.FAILED;
  //         }
  //         if (oldData.name === "TOTAL") {
  //           oldData.balance = data.TOTAL;
  //         }
  //       });
  //       setTxnData(newData);
  //     },
  //     (err) => {
  //       apiErrorToast(err);
  //     }
  //   );
  // };

  // useEffect(() => {
  //   if (user.role !== "Zsm") {
  //     getGraphData();
  //   }
  //   if (
  //     user.role !== "Ret" &&
  //     user.role !== "Dd" &&
  //     user.role !== "Asm" &&
  //     user.role !== "Zsm"
  //   ) {
  //     getTxnData();
  //   }
  //   return () => {};
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [graphDuration]);

  return (
    <Grid
      item
      lg={user.role === "Admin" ? 6.5 : 8}
      md={8.5}
      sm={11.8}
      xs={11.2}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Grid
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            justifyContent: "center",
            padding: "0.1rem",
            // boxShadow:
            //   "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            //   width: { lg: "99%", md: "95%", sm: "100%" },
            ml: { lg: "0", md: "0", xs: "0" },
            mr: { lg: "1.5%", md: 0, xs: 0 },
          }}
        >
          {user &&
            user.role !== "Ret" &&
            user.role !== "Dd" &&
            user.role !== "Asm" &&
            user.role !== "Zsm" && (
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.5rem",
                }}
                className="position-relative"
                // onClick={getTxnData}
              >
                {/* <Spinner loading={txnDataReq} circleBlue /> */}
                {txnData &&
                  txnData.map((item, index) => (
                    <Grid key={index} item lg={12} xs={12} sm={12} md={12}>
                      <DashboardDataComponent1
                        users={item}
                        data="txn"
                        index={index}
                        len={txnData.length}
                      />
                    </Grid>
                  ))}
              </Grid>
            )}
        </Grid>
        <Grid
          sx={{
            background: "#fff",
            borderRadius: "8px",
            padding: "1.3rem",
            justifyContent: "flex-start",
            boxShadow:
              "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            width: { lg: "99%", md: "95%", sm: "100%" },
            ml: { lg: "0", md: "0", xs: "0" },
            mr: { lg: "1.5%", md: 0, xs: 0 },
            height: "514px",
            mt: 0.6,
          }}
        >
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              style={{
                fontWeight: "500",
                fontSize: "18px",
                display: "flex",
                alignContent: "center",
              }}
            >
              Product Sale
              <CachedOutlinedIcon
                className="ms-2 refresh-purple"
                sx={{
                  transform: "scale(1)",
                  transition: "0.5s",
                  "&:hover": { transform: "scale(1.2)" },
                  ml: 1,
                }}
                onClick={() => {
                  if (showProductTable) {
                    refreshFunc(setQuery);
                  } else {
                    getGraphData();
                    if (user && (user.role !== "Asm" || user.role !== "Zsm")) {
                      // getTxnData();
                    }
                  }
                }}
              />
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  mr: 1,
                }}
              >
                Monthly Data
              </Typography>
              <Switch
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#000",
                  },
                }}
                checked={showMonthlyData}
                onChange={handleToggleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>
          </Grid>

          <Grid container>
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{ minHeight: { md: "350px", sm: "180px", xs: "180px" } }}
              className="position-relative"
            >
              {/* <Spinner loading={graphRequest && !showProductTable} circleBlue /> */}

              {user &&
              (user.role === "Asm" || user.role === "Zsm") &&
              showProductTable ? (
                <></>
              ) : // <Grid item xs={12} lg={12} sm={12} md={12}>
              //   <ApiPaginate
              //     apiEnd={ApiEndpoints.GET_RET_PROD_SALE}
              //     columns={columnsProd}
              //     apiData={apiData}
              //     tableStyle={massegetable}
              //     setApiData={setApiData}
              //     queryParam={query ? query : ""}
              //     returnRefetch={(ref) => {
              //       refresh = ref;
              //     }}
              //     ExpandedComponent={null}
              //     paginateServer={false}
              //     paginate={false}
              //   />
              // </Grid>
              showMonthlyData ? (
                <MonthlyDataChart />
              ) : !showProductTable &&
                graphDuration &&
                graphDuration === "TODAY" ? (
                <AdminBarChart graphData={graphData} />
              ) : (
                ((!showProductTable && graphDuration === "THIS") ||
                  graphDuration === "LAST") && (
                  <>
                    {showAllGraph ? (
                      <LineChartAllServices graphData={graphAllData} />
                    ) : (
                      <AdminLineChart graphData={graphData} />
                    )}
                  </>
                )
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default ProductionSaleComponent;

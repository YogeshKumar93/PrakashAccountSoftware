import { Box, Grid, Typography } from "@mui/material";

import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import { useLocation } from "react-router-dom";
import DashboardDataToggleComponent from "./DashboardDataToggleComponent";
import NewsSection from "./NewsSection";
import AdminWalletBalanceComponent from "./AdminWalletBalanceComponent";
import DashboardDataComponent2 from "./DashboardDataComponent2";
import ProductionSaleComponent from "./ProductionSaleComponent";
import AsmProductionSaleComponent from "./AsmProductionSaleComponent";
import RetTxnCardComponent from "./RetTxnCardComponent";

const AdminDashboard = ({
  graphDuration,
  setGraphDuration,
  user,
  request,
  userData,
  graphRequest,
  setGraphRequest,
  getTxnData,
  txnDataReq,
  txnData,
}) => {
  const location = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {/* user by roles cards */}
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: { md: 1, lg: -2, xs: 1, sm: 1 },
        }}
      >
        <Grid xs={12} md={12} lg={2} item>
          <DashboardDataToggleComponent
            graphDuration={graphDuration}
            setGraphDuration={setGraphDuration}
          />
        </Grid>
        {location.pathname === "/admin/dashboard" && (
          <Grid item xs={12} sm={12} md={9.3} lg={8.8} sx={{ ml: 2, mb: 0.5 }}>
            <NewsSection />
          </Grid>
        )}

        <AdminWalletBalanceComponent graphDuration={graphDuration} />
      </Grid>

      {user && user.role !== "asm" && user.role !== "zsm" && (
        <Grid
          container
          columnSpacing={1.5}
          md={12}
          sm={12}
          xs={11.2}
          lg={12}
          sx={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            borderRadius: "8px",
            my: { md: 1, lg: 2, xs: 1, sm: 1 },
          }}
          className="position-relative"
        >
          {/* <Loader loading={request} /> */}
          {user?.role === "adm" &&
            userData &&
            userData.map((item, index) => (
              <Grid
                key={index}
                item
                xs={12}
                sm={6}
                md={2.4}
                lg={1.7}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DashboardDataComponent2 users={item} />
              </Grid>
            ))}
        </Grid>
      )}

      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "start",
          mb: 1,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <ProductionSaleComponent
          graphDuration={graphDuration}
          setGraphDuration={setGraphDuration}
          graphRequest={graphRequest}
          setGraphRequest={setGraphRequest}
        />
        {user && user.role !== "asm" && user.role !== "zsm" ? (
          <AsmProductionSaleComponent />
        ) : (
          <Grid
            item
            lg={3.9}
            md={3.3}
            sm={11.8}
            xs={11.2}
            sx={{
              background: "#fff",
              borderRadius: "8px",
              padding: "1.3rem",
              height: "auto",
              boxShadow:
                "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
              ml: { lg: 1, md: 1, sm: 0, xs: 0 },
              mt: { md: 0, xs: 1, sm: 1, lg: 0.7 },
            }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                flexDirection: { xs: "column", md: "row" },
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
                {graphDuration === "TODAY"
                  ? "Today's"
                  : graphDuration === "LAST"
                  ? "Last Month's"
                  : graphDuration === "THIS"
                  ? "This Month's"
                  : ""}
                Transactions
                <CachedOutlinedIcon
                  className="ms-2 rotate-on-hover"
                  sx={{
                    transform: "scale(1)",
                    transition: "0.5s",
                    "&:hover": { transform: "scale(1.2)" },
                    ml: 1,
                  }}
                  onClick={() => {
                    if (getTxnData) {
                      getTxnData();
                    }
                  }}
                />
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={10}
              lg={10}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "8px",
              }}
            >
              {/* {txnDataReq && <Loader loading={txnDataReq} circleBlue />} */}
              {txnData?.length > 0 &&
                txnData.map((item, index) => (
                  <Grid
                    item
                    key={index}
                    xs={2.8}
                    sm={2.8}
                    md={4}
                    lg={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                      }}
                    >
                      <RetTxnCardComponent item={item} isTransaction />
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

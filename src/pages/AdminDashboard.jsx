import { Box, Grid, Typography, Card, CardContent, IconButton, useTheme } from "@mui/material";
import { RefreshRounded } from "@mui/icons-material";
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
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
        p: { xs: 1, sm: 1, md: 1 },
        mt:-2
      }}
    >

     {location.pathname === "/admin/dashboard" && (
          <Grid item xs={12} lg={6}>
            <Card 
              sx={{ 
                height: 30,
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                background: "white"
              }}
            >
              <CardContent sx={{ p: 0}}>
                <NewsSection />
              </CardContent>
            </Card>
          </Grid>
        )}

      {/* Header Section */}
      <Grid container spacing={3} sx={{ mb: 0, mt:1 }}>
        <Grid item xs={12} lg={3}>
          <Card 
            sx={{ 
              height: "80%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <DashboardDataToggleComponent
                graphDuration={graphDuration}
                setGraphDuration={setGraphDuration}
              />
            </CardContent>
          </Card>
        </Grid>

   

        <Grid item xs={12}    lg={location.pathname === "/admin/dashboard" ? 3 : 9} >
         <Card 
            sx={{ 
              height: "80%",
              background: "linear-gradient(135deg, #7f859fff 0%, #da455dff 100%)",
              color: "white",
              borderRadius: 3,
              mb:1,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
            }}
          >
          <AdminWalletBalanceComponent graphDuration={graphDuration}  />
          </Card>
        </Grid>
      </Grid>

      {/* User Roles Cards Section */}
      {user && user.role !== "asm" && user.role !== "zsm" && (
        <Card 
          sx={{ 
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            background: "white"
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {user?.role === "adm" &&
                userData &&
                userData.map((item, index) => (
                  <Grid
                    key={index}
                    item
                    xs={6}
                    sm={4}
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
          </CardContent>
        </Card>
      )}

      {/* Main Content Section */}
      <Grid container spacing={3}>
        {/* Production Sale Component */}
        <Grid item xs={12} lg={user && user.role !== "asm" && user.role !== "zsm" ? 8 : 12}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              background: "white",
              height: "100%",
              width:540
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <ProductionSaleComponent
                graphDuration={graphDuration}
                setGraphDuration={setGraphDuration}
                graphRequest={graphRequest}
                setGraphRequest={setGraphRequest}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Conditional Components */}
        {user && user.role !== "asm" && user.role !== "zsm" ? (
          <Grid item xs={12} lg={4}>
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                background: "white",
                height: "100%",
                width:535
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <AsmProductionSaleComponent />
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12} lg={4}>
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                background: "white",
                height: "100%"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    flexWrap: "wrap",
                    gap: 1
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "600",
                      color: theme.palette.text.primary,
                      display: "flex",
                      alignItems: "center",
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
                  </Typography>
                  
                  <IconButton
                    onClick={() => {
                      if (getTxnData) {
                        getTxnData();
                      }
                    }}
                    sx={{
                      background: theme.palette.primary.light,
                      color: "white",
                      "&:hover": {
                        background: theme.palette.primary.main,
                        transform: "rotate(180deg)",
                        transition: "all 0.3s ease"
                      }
                    }}
                  >
                    <RefreshRounded />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  {txnData?.length > 0 &&
                    txnData.map((item, index) => (
                      <Grid
                        item
                        key={index}
                        xs={12}
                        sm={6}
                        md={6}
                        lg={12}
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
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
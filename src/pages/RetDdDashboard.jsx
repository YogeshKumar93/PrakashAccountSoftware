import React, { useContext, useState } from "react";
import { Grid, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import RetProductionSaleComponent from "./RetProductionSaleComponent";
import AuthContext from "../contexts/AuthContext";
import NewsSection from "./NewsSection";
import { USER_ROLES } from "../utils/constants";

const RetDdDashboard = () => {
  const [graphDuration, setGraphDuration] = useState("TODAY");
  const [graphRequest, setGraphRequest] = useState(false);
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  const role = authCtx.user.role;

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        p: 1,
      }}
    >
      <NewsSection />

      <Grid
        container
        sx={{
          flex: 1, // take remaining height
          gap: 2,
          height: "100%",
          width: "100%",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            padding: 1,
            border: "1px solid #ccc",
            borderRadius: 2,
            height: "100%", // full height
          }}
        >
          <RetProductionSaleComponent
            graphDuration={graphDuration}
            setGraphDuration={setGraphDuration}
            graphRequest={graphRequest}
            setGraphRequest={setGraphRequest}
            role={role}
            USER_ROLES={USER_ROLES}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RetDdDashboard;

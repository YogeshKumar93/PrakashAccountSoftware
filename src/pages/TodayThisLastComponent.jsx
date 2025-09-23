import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import RetTxnCardComponent from "./RetTxnCardComponent";

// Styled Tabs
export const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    variant="scrollable"
    scrollButtons="auto"
    TabIndicatorProps={{
      children: <span className="MuiTabs-indicatorSpan" />,
    }}
  />
))({
  padding: "8px 8px",
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 80,
    width: "0px",
    backgroundColor: "#ffffff",
  },
});

// Styled Tab
export const StyledTab = styled((props) => <Tab disableRipple {...props} />)({
  color: "#fff",
  fontSize: "14px",
  minHeight: "15px",
  minWidth: "25px",
  zIndex: 1,
  padding: "8px 8px",
  borderRadius: "4px",
  // backgroundColor: `hsla(0,0%,100%,.2)`,
  // "&.Mui-selected": {
  //   color: "#fff",
  //   backgroundColor: `hsla(0,0%,100%,.2)`,
  //   transition: `background-color .3s .2s`,
  // },
  // "&.Mui-focusVisible": {
  //   backgroundColor: "rgba(100, 95, 228, 0.32)",
  // },
});

const TodayThisLastComponent = ({
  txnDataDuration,
  txnDataReq,
  txnData,
  getTxnData,
  handleChange,
}) => {
  const [isActive, setIsActive] = useState("TODAY");

  const handleTabChange = (value) => {
    setIsActive(value);
    if (handleChange) {
      handleChange(null, value);
    }
  };

  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          mb: 1,
        }}
      >
        {/* Transaction Cards */}
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
                md={2.8}
                lg={3}
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
                  <RetTxnCardComponent item={item} />
                </Box>
              </Grid>
            ))}
        </Grid>

        {/* Tab Filters */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            width: { lg: "190px", sm: "100%" },
            height: { lg: "150px", sm: "100%" },
            padding: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mb: 2,
            }}
          >
            <Button
              sx={{
                color: txnDataDuration === "TODAY" ? "#fff" : "#000", // Adjust text color based on selection
                fontWeight: "bold",
                padding: "6px 15px",
                width: { xs: "80px", sm: "100px" },
                border: `1px solid #D48628`,
                textTransform: "none",
                backgroundColor:
                  txnDataDuration === "TODAY" ? "#D48628" : "transparent",
                "&:hover": {
                  border: `1px solid #000}`,
                  backgroundColor: "#000",
                  color: "#fff",
                },
              }}
              onClick={() => handleTabChange("TODAY")}
            >
              TODAY
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <Button
              sx={{
                color: txnDataDuration === "THIS" ? "#fff" : "#000", // Adjust text color based on selection
                fontWeight: "bold",
                padding: "6px 15px",
                border: `1px solid #D48628`,
                textTransform: "none",
                backgroundColor:
                  txnDataDuration === "THIS" ? "#D48628" : "transparent",
                "&:hover": {
                  border: `1px solid #000}`,
                  backgroundColor: "#D48628",
                  color: "#fff",
                },
              }}
              onClick={() => handleTabChange("THIS")}
            >
              THIS
            </Button>

            <Button
              sx={{
                color: txnDataDuration === "LAST" ? "#fff" : "#000", // Adjust text color based on selection
                fontWeight: "bold",
                padding: "6px 15px",
                border: `1px solid #D48628`,
                textTransform: "none",
                backgroundColor:
                  txnDataDuration === "LAST" ? "#D48628" : "transparent",
                "&:hover": {
                  border: `1px solid #000}`,
                  backgroundColor: "#D48628",
                  color: "#fff",
                },
              }}
              onClick={() => handleTabChange("LAST")}
            >
              LAST
            </Button>
          </Box>
        </Grid>

        {/* <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            width: { lg: "180px", sm: "100%" },
            height: { lg: "150px", sm: "100%" },
            padding: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mb: 2,
             
            }}
          >
            <Button
              label="TODAY"
              value="TODAY"
              sx={{
                color: "#000",
                fontWeight: "bold",
               
                                padding: "6px 15px",
                width: { xs: "80px", sm: "100px" },
                border: `1px solid #D48628`,
                textTransform: "none",
                backgroundColor: txnDataDuration === "TODAY" ? "#D48628" : "transparent",
                "&.Mui-selected": {
                  backgroundColor: primaryColor(),
                  color: "white",
                },
                "&:hover": {
                  border: `1px solid ${primaryColor()}`,
                  backgroundColor: primaryColor(),
                  color: "#fff",
                },
              }}
              onClick={() => handleTabChange("TODAY")}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <StyledTab
              label="THIS"
              value="THIS"
              sx={{
                color: txnDataDuration === "THIS" ? "#fff" : "#000",
                fontWeight: "bold",
                px: 1,
                border: `1px solid #D48628`,
                textTransform: "none",
                backgroundColor: txnDataDuration === "THIS" ? "#D48628" : "transparent",
                "&.Mui-selected": {
                  backgroundColor: "#D48628",
                  color: "white",
                },
                "&:hover": {
                  border: `1px solid ${secondaryColor()}`,
                  backgroundColor: "#D48628",
                  color: "#fff",
                },
              }}
              onClick={() => handleTabChange("THIS")}
            />
            <StyledTab
              label="LAST"
              value="LAST"
              sx={{
                color: txnDataDuration === "LAST" ? "#fff" : "#000",
                fontWeight: "bold",
                px: 1,
                border: `1px solid #D48628`,
                textTransform: "none",
                backgroundColor: txnDataDuration === "LAST" ? "#D48628" : "transparent",
                "&.Mui-selected": {
                  backgroundColor: "#D48628",
                  color: "white",
                },
                "&:hover": {
                  border: `1px solid ${primaryLight()}`,
                  backgroundColor: "#D48628",
                  color: "#fff",
                },
              }}
              onClick={() => handleTabChange("LAST")}
            />
          </Box>
        </Grid> */}
      </Grid>
    </>
  );
};

export default TodayThisLastComponent;

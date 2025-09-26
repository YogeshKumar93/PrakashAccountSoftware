import React, { useState } from "react";
import { Box, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";

// Reusable TabPanel
const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: { xs: 1, sm: 2 } }}>{children}</Box>}
    </div>
  );
};

const CommonTabs = ({ tabs = [], defaultTab = 0 }) => {
  const [tab, setTab] = useState(defaultTab);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // small screens

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Custom Styled Tabs */}
    <Box
  sx={{
    bgcolor: "#d4e8e8ff",
    borderRadius: { xs: "0 0 8px 8px", sm: "0 0 8px 8px" },
    display: "flex",
    justifyContent: "center", // <-- Center the tabs
    p: { xs: 0.5, sm: 1 },
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "100%",
    overflowX: "auto",
    mx: "auto",
    mt: { xs: -2, sm: -2.5 },
  }}
>
  <Tabs
    value={tab}
    onChange={handleChange}
    variant="scrollable"
    scrollButtons="auto"
    TabIndicatorProps={{ style: { display: "none" } }}
    sx={{
       minHeight: "24px", // <-- reduce Tabs height
    "& .MuiTab-root": {
      minWidth: { xs: 80, sm: 100, md: 130 },
      minHeight: "24px", // <-- reduce Tab height
      borderRadius: "10px",
      textTransform: "uppercase",
      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
      color: "#49299eff",
      display: "flex",
      flexDirection: "row",
      gap: "8px",
      padding: { xs: "2px 4px", sm: "2px 6px" }, // <-- reduce padding
    },
    "& .MuiTab-root .MuiTab-wrapper": {
      fontFamily: `"DM Sans", sans-serif !important`,
    },
    "& .Mui-selected": {
      backgroundColor: "#f2f2ebff",
      color: "#2ecb46ff",
      fontWeight: 500,
    },
    }}
  >
    {tabs.map((tabItem, index) => (
      <Tab key={index} icon={tabItem.icon} label={isMobile ? null : tabItem.label} />
    ))}
  </Tabs>
</Box>


      {/* Tab Panels */}
      {tabs.map((tabItem, index) => (
        <TabPanel key={index} value={tab} index={index}>
          {tabItem.component}
        </TabPanel>
      ))}
    </Box>
  );
};

export default CommonTabs;

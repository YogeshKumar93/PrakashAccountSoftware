import React from "react";
import PropTypes from "prop-types";
import { AppBar, Tabs, Tab, Box, Typography, useMediaQuery, useTheme } from "@mui/material";

function CustomTabs({ tabs, value, onChange, heading }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <AppBar position="static">
      <Tabs
  value={value}
  onChange={onChange}
  variant={isSmallScreen ? "scrollable" : "fullWidth"}
  scrollButtons={isSmallScreen ? "auto" : false}
  aria-label="full width tabs example"
  sx={{
    "& .MuiTabs-indicator": {
      backgroundColor: "#8B8000",
    },
    "& .MuiTab-root": {
      color: "#000",
      fontSize: isSmallScreen ? "0.6rem" : "0.7rem", 
      minHeight: isSmallScreen ? "24px" : "30px", 
      padding: isSmallScreen ? "4px 8px" : "6px 12px",
      flexDirection: isSmallScreen ? "column" : "row", 
      gap: "4px",
      "& .MuiSvgIcon-root": {
        color: "#E8960C",
        fontSize: isSmallScreen ? "18px" : "24px", 
      },
    },
    "& .MuiTab-root.Mui-selected": {
      color: "#9B870C",
      "& .MuiSvgIcon-root": {
        color: "#9B870C",
      },
    },
    minHeight: isSmallScreen ? "26px" : "30px",
  }}
>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              {...a11yProps(index)}
              sx={{
                bgcolor: "white",
                color: "black",
                minHeight: "30px",
                fontSize: "0.800rem",
                padding: "6px 12px",
                flexDirection: "row",
                gap: "8px",
              }}
            />
          ))}
        </Tabs>
      </AppBar>
      {heading && (
        <Box sx={{ p: 1, pb: 0.5 }}>
          {" "}
          {/* Further reduced padding, especially bottom padding */}
          <Typography variant="h5" component="h1" gutterBottom>
            {heading}
          </Typography>
        </Box>
      )}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1, overflow: "auto" }}>
          {" "}
          {/* Further reduced padding */}
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// Accessibility props
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

CustomTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  heading: PropTypes.string,
};

export default CustomTabs;

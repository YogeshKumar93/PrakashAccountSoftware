import React from "react";
import PropTypes from "prop-types";
import { AppBar, Tabs, Tab, Box, Typography, useMediaQuery, useTheme } from "@mui/material";

function CustomTabs({ tabs, value, onChange, heading }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #e0e0e0',
      }}
    >
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', borderBottom: '1px solid #f0f0f0' }}>
        <Tabs
          value={value}
          onChange={onChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="custom tabs"
          sx={{
            "& .MuiTabs-scroller": { overflowX: "auto !important" },
            "& .MuiTabs-indicator": { display: "none" }, // hide default indicator
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              {...a11yProps(index)}
              sx={{
                minHeight: 60,
                minWidth: 140,
                marginRight: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isSmallScreen ? "0.75rem" : "0.9rem",
                backgroundColor: value === index ? "#d28e19ff" : "#f0f0f0", 
                color: value === index ? "#fff" : "#555",
                boxShadow: value === index ? "0 4px 12px rgba(25, 118, 210, 0.2)" : "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: value === index ? "#935211ff" : "#e0e0e0",
                },
                "& .MuiSvgIcon-root": {
                  marginRight: 6,
                  color: value === index ? "#fff" : "#555",
                  fontSize: isSmallScreen ? 18 : 20,
                },
              }}
            />
          ))}
        </Tabs>
      </AppBar>

      {heading && (
        <Box sx={{ p: 2.5, pb: 1.5 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#202124' }}>
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
        <Box sx={{ p: 3 }}>
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
      icon: PropTypes.node,
    })
  ).isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  heading: PropTypes.string,
};

export default CustomTabs;

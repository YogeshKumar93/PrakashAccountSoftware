import { Box, Button } from "@mui/material";
import React from "react";
import { useState } from "react";

const DashboardDataToggleComponent = ({ setGraphDuration }) => {
  const [isActive, setIsActive] = useState("TODAY");

  return (
    <Box
      sx={{
        display: "flex",
        "& .MuiButton-root": { mx: 0.5 },
      }}
    >
      <Button
        variant="outlined"
        sx={{
          background: isActive && isActive === "TODAY" ? "#1877F2" : "#fff",
          fontWeight: "bold",
          border: "1px solid" + "#1877F2",
          color: isActive && isActive === "TODAY" ? "#fff" : "#1877F2",
          "&:hover": {
            border: "1px solid" + "#1877F2",
            color: "#fff",
            background: "#1877F2",
          },
        }}
        onClick={() => {
          setIsActive("TODAY");
          setGraphDuration("TODAY");
        }}
      >
        Today
      </Button>
      <Button
        variant="outlined"
        color="warning"
        sx={{
          background: isActive && isActive === "THIS" ? "#1877F2" : "#fff",
          fontWeight: "bold",
          border: "1px solid" + "#1877F2",
          color: isActive && isActive === "THIS" ? "#fff" : "#1877F2",
          "&:hover": {
            border: "1px solid" + "#1877F2",
            color: "#fff",
            background: "#1877F2",
          },
        }}
        onClick={() => {
          setGraphDuration("THIS");
          setIsActive("THIS");
        }}
      >
        This
      </Button>
      <Button
        variant="outlined"
        sx={{
          // 00bf78
          background: isActive && isActive === "LAST" ? "#1877F2" : "#fff",
          fontWeight: "bold",
          border: "1px solid" + "#1877F2",
          color: isActive && isActive === "LAST" ? "#fff" : "#1877F2",
          "&:hover": {
            border: "1px solid" + "#1877F2",
            color: "#fff",
            background: "#1877F2",
          },
        }}
        onClick={() => {
          setGraphDuration("LAST");
          setIsActive("LAST");
        }}
      >
        Last
      </Button>
      {/* <ToggleButtonGroup
        orientation="horizontal"
        value={graphDuration}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton
        value="TODAY"
        aria-label="list"
        className="custome-toggle cm-hover"
      >
        Today
      </ToggleButton>
        <ToggleButton
          value="THIS"
          aria-label="module"
          className="custome-toggle cm-hover"
        >
          This
        </ToggleButton>
        <ToggleButton
          value="LAST"
          aria-label="quilt"
          className="custome-toggle cm-hover"
        >
          Last
        </ToggleButton>
      </ToggleButtonGroup> */}
    </Box>
  );
};

export default DashboardDataToggleComponent;

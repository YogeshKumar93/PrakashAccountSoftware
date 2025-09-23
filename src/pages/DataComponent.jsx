import React from "react";
import { Typography, Button, LinearProgress, Box, Slider } from "@mui/material";

const DataComponent = () => {
  const currentSpending = 252.98;
  const totalLimit = 1200;
  const progress = (currentSpending / totalLimit) * 100;

  return (
    <Box
      sx={{
        width: "100%",
        // borderRadius: "8px",
        // boxShadow:
        //   "rgba(0, 0, 0, 0.05) 0px 6px 24px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
        // p: 2,
        // width: "100%",
        // backgroundColor: "#fff", // Added background color to replicate the card-like feel
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            Spending Limit
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Data from 1–12 Apr, 2024
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          sx={{
            textTransform: "none",
            fontSize: "12px",
            borderRadius: "16px",
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "primary.light",
            },
          }}
        >
          View Report
        </Button>
      </Box>

      {/* Current Spending and Progress */}
      <Box textAlign="center" mb={2}>
        <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: "4px" }}>
          ${currentSpending.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          of ${totalLimit.toLocaleString()}
        </Typography>
      </Box>

      {/* Dashed Progress Bar */}
      <Box sx={{ position: "relative", mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: "10px",
            borderRadius: "5px",
            backgroundColor: "#E0E0E0",
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                progress > 75
                  ? "#FF7043"
                  : progress > 50
                  ? "#FFC107"
                  : "#1976D2", // Using blue for progress
              border: "2px dashed", // Adds dashed effect to the progress bar
              borderColor:
                progress > 75
                  ? "#FF7043"
                  : progress > 50
                  ? "#FFC107"
                  : "#1976D2", // Matching the progress bar color
            },
            "& .MuiLinearProgress-root": {
              border: "2px dashed #1976D2",
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "0",
            left: `${progress}%`,
            transform: "translateX(-50%)",
            fontSize: "14px",
            fontWeight: "bold",
            color: progress > 75 ? "#FF7043" : "#FFC107",
          }}
        >
          {progress.toFixed(0)}%
        </Box>
      </Box>

      <Box>
        <Typography variant="caption" color="textSecondary" gutterBottom>
          Adjust Progress
        </Typography>
        <Slider
          value={progress}
          min={0}
          max={100}
          step={1}
          sx={{
            color: "#1976D2",
            "& .MuiSlider-thumb": {
              backgroundColor: "#1976D2",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default DataComponent;

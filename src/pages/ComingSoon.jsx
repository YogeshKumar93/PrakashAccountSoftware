import React from "react";
import { Box, Typography } from "@mui/material";

const ComingSoon = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        p: 3,
        height: "200px",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#5210c1",
          mb: 1,
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        🚧 Coming Soon
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          maxWidth: 280,
          lineHeight: 1.4,
        }}
      >
        We’re working hard to bring you this feature. Stay tuned!
      </Typography>
    </Box>
  );
};

export default ComingSoon;

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Collapse,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import {
  Person,
  Phone,
  AccountBalance,
  VerifiedUser,
} from "@mui/icons-material";

const SoliTechSenderDetails = ({ sender }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);

  const iconWrapperStyle = {
    width: 36,
    height: 36,
    borderRadius: "50%",
    bgcolor: "#eaf4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mr: 1.2,
  };

  const iconStyle = { fontSize: 18, color: "#2275b7" };

  return (
    <Card
      sx={{
        borderRadius: 2,
        width: "100%",
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e0e4ec",
        overflow: "hidden",
      }}
    >
      <Collapse in={open} timeout="auto" unmountOnExit>
        {sender ? (
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            {/* Use Grid container with justifyContent space-between */}
            <Grid
              container
              spacing={isMobile ? 1 : 2}
              justifyContent="space-between"
            >
              {/* Name */}
              <Grid item xs={12} sm={5.8}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <Box sx={iconWrapperStyle}>
                      <Person sx={iconStyle} />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Name
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {sender?.sender_name || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Number */}
              <Grid item xs={12} sm={5.8}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <Box sx={iconWrapperStyle}>
                      <Phone sx={iconStyle} />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Number
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {sender?.mobile_number || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* KYC Status */}
              <Grid item xs={12} sm={5.8}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <Box sx={iconWrapperStyle}>
                      <VerifiedUser sx={iconStyle} />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        KYC Status
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        textTransform="capitalize"
                      >
                        {sender?.kyc_status || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Remaining Limit */}
              <Grid item xs={12} sm={5.8}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <Box sx={iconWrapperStyle}>
                      <AccountBalance sx={iconStyle} />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Remaining Limit
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="#2275b7"
                      >
                        ₹{sender?.rem_limit?.toLocaleString() || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight={120}
          >
            <Typography variant="body2" color="text.secondary">
              Enter Mobile Number to view sender details
            </Typography>
          </Box>
        )}
      </Collapse>
    </Card>
  );
};

export default SoliTechSenderDetails;

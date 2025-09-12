import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  Stack,
  Button,
  IconButton,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const Beneficiaries = ({ beneficiaries, onSelect, onDelete, onVerify }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);

  // normalize to always have at least one "N/A" entry
  const normalized =
    beneficiaries && beneficiaries.length > 0
      ? beneficiaries
      : [
          {
            id: "na",
            beneficiary_name: "No beneficiaries added",
            name: "N/A",
            ifsc: "N/A",
            account: "N/A",
            verificationDt: null,
            bank_name: null,
          },
        ];

  const bankImageMapping = {}; // add mappings if needed

  return (
     <Card 
      sx={{ 
        borderRadius: 2,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
         {/* Header */}
      <Box
        sx={{
          bgcolor: "#0078B6",
          color: "#fff",
          py: 1,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Beneficiary List ({beneficiaries?.length || 0})
        </Typography>
        {isMobile && (
        <IconButton size="small" sx={{ color: "white" }}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        )}
      </Box>

      {/* Collapse wrapper */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 2 }}>
          <List dense sx={{ py: 0 }}>
            {normalized.map((b) => (
              <ListItem
                key={b.id}
                sx={{
                  py: 1.5,
                  px: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: b.id === "na" ? "transparent" : "divider",
                  backgroundColor:
                    b.id === "na" ? "transparent" : "background.paper",
                  boxShadow:
                    b.id !== "na" ? "0 2px 6px rgba(0,0,0,0.04)" : "none",
                  opacity: b.id === "na" ? 0.7 : 1,
                }}
                secondaryAction={
                  b.id !== "na" && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      {b.verificationDt ? (
                        <Box display="flex" alignItems="center" gap={0.3}>
                          <CheckCircleIcon
                            sx={{ fontSize: 16, color: "success.main" }}
                          />
                          <Typography
                            variant="caption"
                            color="success.main"
                            fontWeight="500"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            Verified
                          </Typography>
                        </Box>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          onClick={() => onVerify?.(b)}
                          sx={{
                            borderRadius: 1,
                            textTransform: "none",
                            fontSize: "0.75rem",
                            px: 1,
                            py: 0.2,
                          }}
                        >
                          Verify
                        </Button>
                      )}

                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => onSelect?.(b)}
                        sx={{
                          borderRadius: 1,
                          textTransform: "none",
                          fontSize: isMobile ? "0.6rem" : "0.75rem",
                          px: 1,
                          py: 0.2,
                        }}
                      >
                        Send Money
                      </Button>

                      <IconButton
                        edge="end"
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(b.id);
                        }}
                        sx={{
                          backgroundColor: "error.light",
                          "&:hover": { backgroundColor: "error.main" },
                          color: "white",
                        }}
                      >
                        <Tooltip title="Delete Beneficiary">
                          <DeleteIcon fontSize="small" />
                        </Tooltip>
                      </IconButton>
                    </Stack>
                  )
                }
              >
                <Box display="flex" alignItems="center" gap={1.5} width="100%">
                  {/* Bank logo */}
                  {bankImageMapping[b.bank_name] ? (
                    <Box
                      component="img"
                      src={bankImageMapping[b.bank_name]}
                      alt={b.bank_name}
                      sx={{
                        width: 36,
                        height: 36,
                        objectFit: "contain",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        p: 0.5,
                        backgroundColor: "white",
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "primary.light",
                        fontSize: 16,
                      }}
                    >
                      <AccountBalanceIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}

                  {/* Details */}
                  <Box flexGrow={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        noWrap
                        sx={{
                          fontSize: isMobile ? "0.7rem" : "1rem",
                          color:
                            b.id === "na" ? "text.secondary" : "text.primary",
                        }}
                      >
                        {b.name}
                      </Typography>
                    </Box>
                    <Stack
                      direction={isMobile ? "column" : "row"}
                      spacing={isMobile ? 0.5 : 2}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        <Box component="span" fontWeight="500" mr={0.5}>
                          IFSC:
                        </Box>
                        {b.ifsc}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        <Box component="span" fontWeight="500" mr={0.5}>
                          A/C:
                        </Box>
                        {b.account}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Beneficiaries;

import React from "react";
import { useMemo, useContext, useState, useEffect, useRef } from "react";
import {
  Tooltip,
  IconButton,
  Box,
  Button,
  Typography,
  Chip,
} from "@mui/material";
import { Phone, AccessTime, CalendarToday } from "@mui/icons-material";
import { Edit } from "@mui/icons-material";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../utils/DateUtils";
import CreateBankModal from "../components/Bank/CreateBanks";
import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";
import CommonLoader from "../components/common/CommonLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateBanks from "../components/Bank/UpdateBanks";
import DeleteBank from "./DeleteBank";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import UpdateComplaint from "../components/UpdateComplains";
const Complaint = ({ filters = [] }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRole = authCtx?.user?.role; // Get current user role from auth context
  const fetchComplaintsRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all"); // default

  const handleFetchRef = (fetchFn) => {
    fetchComplaintsRef.current = fetchFn;
  };

  const refreshComplaints = () => {
    if (fetchComplaintsRef.current) {
      fetchComplaintsRef.current();
    }
  };

  useEffect(() => {
    if (fetchComplaintsRef.current) {
      fetchComplaintsRef.current({ status: activeTab });
    }
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ role-based filters
  // const finalFilters = useMemo(() => {
  //   if (user?.username === "sadm" || user?.username === "adm") return filters;
  //   return [...filters, { field: "user_id", operator: "=", value: user?.id }];
  // }, [filters, user]);

  const columns = useMemo(
    () => [
      {
        name: "Date & Time",
        selector: (row) => (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Tooltip
              title={`Created: ${ddmmyyWithTime(row.created_at)}`}
              arrow
              placement="top"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                >
                  {ddmmyy(row.created_at)}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip
              title={`Updated: ${ddmmyyWithTime(row.updated_at)}`}
              arrow
              placement="top"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTime sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                >
                  {dateToTime1(row.updated_at)}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        ),
        width: "140px",
        wrap: true,
      },
      {
        name: "Transaction ID",
        selector: (row) => (
          <Tooltip title={row.txnId} arrow placement="top">
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                fontFamily: "monospace",
                backgroundColor: "grey.50",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              {row.txnId}
            </Typography>
          </Tooltip>
        ),
        width: "160px",
        wrap: true,
      },
      {
        name: "Establishment",
        selector: (row) => (
          <Typography
            variant="body2"
            sx={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            {row.establishment || "N/A"}
          </Typography>
        ),
        width: "150px",
        wrap: true,
      },
      {
        name: "Operator",
        selector: (row) => (
          <Chip
            label={row.operator}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.75rem", height: "24px" }}
          />
        ),
        width: "140px",
        wrap: true,
      },
      {
        name: "Route",
        selector: (row) => (
          <Chip
            label={row.route}
            size="small"
            color="primary"
            variant="filled"
            sx={{ fontSize: "0.75rem", height: "24px" }}
          />
        ),
        width: "100px",
        wrap: true,
      },
      {
        name: "Mobile Number",
        selector: (row) => (
          <Tooltip title={row.number} arrow placement="top">
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography
                variant="body2"
                sx={{ fontSize: "0.8rem", fontWeight: 500 }}
              >
                {row.number}
              </Typography>
            </Box>
          </Tooltip>
        ),
        width: "130px",
        wrap: true,
      },
      {
        name: "Amount",
        selector: (row) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              px: 1.5,
              py: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: "0.8rem", fontWeight: 700 }}
            >
              ₹{parseFloat(row.amount).toFixed(2)}
            </Typography>
          </Box>
        ),
        width: "100px",
        center: true,
      },
      {
        name: "Complaint Message",
        selector: (row) => (
          <Tooltip title={row.msg} arrow placement="top-start">
            <Box
              sx={{
                maxWidth: "200px",
                p: 1,
                // backgroundColor: "warning.light",
                borderRadius: 1,
                // border: "1px solid",
                // borderColor: "warning.main",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8rem",
                  color: "#000",
                  fontWeight: 600,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {row.msg}
              </Typography>
            </Box>
          </Tooltip>
        ),
        width: "200px",
        wrap: true,
      },
      {
        name: "Transaction Status",
        selector: (row) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CommonStatus value={row.txn_status} />
          </Box>
        ),
        width: "140px",
        center: true,
      },
      {
        name: "Complaint Status",
        selector: (row) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CommonStatus value={row.status} />
          </Box>
        ),
        width: "140px",
        center: true,
      },
      {
        name: "Remarks",
        selector: (row) => (
          <Tooltip
            title={row.remark || "No remarks"}
            arrow
            placement="top-start"
          >
            <Box sx={{ maxWidth: "150px" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.75rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontStyle: row.remark ? "normal" : "italic",
                  color: row.remark ? "text.primary" : "text.secondary",
                }}
              >
                {row.remark || "No remarks"}
              </Typography>
            </Box>
          </Tooltip>
        ),
        width: "150px",
        wrap: true,
      },
      {
        ...((userRole === "adm" || userRole === "sadm") && {
          name: "Actions",
          selector: (row) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: "120px",
                  minHeight: "40px",
                }}
              >
                {/* For Admin/Super Admin - Show Update button for open/rejected statuses */}
                {userRole === "adm" || userRole === "sadm" ? (
                  row.status === "open" || row.status === "rejected" ? (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Edit sx={{ fontSize: 16 }} />}
                      onClick={() => {
                        setSelectedRow(row);
                        setOpenUpdate(true);
                      }}
                      sx={{
                        fontSize: "0.75rem",
                        px: 2,
                        py: 0.5,
                        minWidth: "auto",
                      }}
                    >
                      Update
                    </Button>
                  ) : (
                    <Chip
                      label={
                        row.status?.charAt(0).toUpperCase() +
                        row.status?.slice(1)
                      }
                      size="small"
                      color={
                        row.status === "resolved"
                          ? "success"
                          : row.status === "in_progress"
                          ? "warning"
                          : row.status === "closed"
                          ? "default"
                          : row.status === "on_hold"
                          ? "secondary"
                          : "default"
                      }
                      variant="outlined"
                      sx={{ fontSize: "0.7rem", fontWeight: 500 }}
                    />
                  )
                ) : (
                  // For regular users - Show status chips only
                  <Chip
                    label={
                      row.status?.charAt(0).toUpperCase() + row.status?.slice(1)
                    }
                    size="small"
                    color={
                      row.status === "open"
                        ? "warning"
                        : row.status === "in_progress"
                        ? "info"
                        : row.status === "resolved"
                        ? "success"
                        : row.status === "closed"
                        ? "default"
                        : row.status === "rejected"
                        ? "error"
                        : row.status === "on_hold"
                        ? "secondary"
                        : "default"
                    }
                    variant="filled"
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      minWidth: "80px",
                    }}
                  />
                )}
              </Box>
            );
          },
          center: true,
          width: "120px",
        }),
      },
    ],
    []
  );
  return (
    <>
      <CommonLoader loading={loading} text="Loading Complaints" />

      {!loading && (
        <>
          <CommonTable
            onFetchRef={handleFetchRef}
            columns={columns}
            endpoint={ApiEndpoints.GET_COMPLAINS}
            // filters={finalFilters} // ✅ role-based filters
            queryParam={{ status: activeTab }}
            // onFiltersChange={handleFilterChange}
            customHeader={
              // <ReButton
              //   label="New Complaint"
              //   onClick={() => setOpenCreate(true)}
              // />
              <Box sx={{ display: "flex", gap: 1 }}>
                {["all", "open", "resolved"].map((status) => (
                  <Button
                    key={status}
                    variant={activeTab === status ? "contained" : "outlined"}
                    color={activeTab === status ? "primary" : "inherit"}
                    onClick={() => {
                      setActiveTab(status);
                      setTimeout(() => {
                        if (fetchComplaintsRef.current) {
                          fetchComplaintsRef.current({ status });
                        }
                      }, 0);
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </Box>
            }
          />

          {/* ✅ Update Modal */}
          <UpdateComplaint
            open={openUpdate}
            onClose={() => setOpenUpdate(false)}
            complaintId={selectedRow?.id}
            onSuccess={refreshComplaints} // refresh table after update
          />
        </>
      )}
    </>
  );
};

export default Complaint;

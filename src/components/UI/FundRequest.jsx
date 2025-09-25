import React, { useState, useContext, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Button,
  Modal,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import CreateFundRequest from "../../pages/CreateFundRequest";
import FundRequestModal from "../../pages/FundRequestModal";
import AuthContext from "../../contexts/AuthContext";
import ReButton from "../common/ReButton";
import CommonStatus from "../common/CommonStatus";
import { ddmmyy, ddmmyyWithTime, dateToTime1 } from "../../utils/DateUtils";
import { currencySetter } from "../../utils/Currencyutil";

const FundRequest = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const fetchUsersRef = useRef(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [status, setStatus] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageOpen = (receiptUrl) => {
    if (!receiptUrl) return;
    const fixedUrl = receiptUrl.replace(/\\\//g, "/");
    setImageSrc(fixedUrl);
    setOpenImage(true);
  };

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };

  const refreshUsers = () => {
    if (fetchUsersRef.current) fetchUsersRef.current();
  };

  const handleOpen = (row, statusType) => {
    setSelectedRow(row);
    setStatus(statusType);
    setOpenModal(true);
  };

  const handleSaveCreate = () => {
    setOpenCreate(false);
    refreshUsers();
  };

  const columns = useMemo(
    () => [
      {
        name: "Date",
        selector: (row) => (
          <Box display="flex" flexDirection="column">
            <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
              <span>
                {ddmmyy(row.created_at)}  
              </span>
            </Tooltip><br/>
            <Tooltip title={`Updated: ${ddmmyyWithTime(row.updated_at)}`} arrow>
              <span>
                {ddmmyy(row.updated_at)}  
              </span>
            </Tooltip>
          </Box>
        ),
        width: "140px",
        wrap: true,
      },
      { name: "ID", selector: (row) => row?.id, width: "70px" },
      {
        name: "Name",
        selector: (row) => <Typography>{row?.name}</Typography>,
        wrap: true,
      },
      {
        name: "Bank",
        selector: (row) => <Typography>{row?.bank_name}</Typography>,
        wrap: true,
      },
      {
        name: "Account / Mode",
        selector: (row) => <Typography>{row?.mode}</Typography>,
        wrap: true,
      },
      {
        name: "Bank Ref ID",
        selector: (row) => <Typography>{row?.bank_ref_id}</Typography>,
        wrap: true,
      },
      {
        name: "Amount",
        selector: (row) => (
          <Typography sx={{ fontWeight: "bold" }}>
            {currencySetter(parseFloat(row?.amount).toFixed(2))}
          </Typography>
        ),
      },
      // {
      //   name: "Receipt",
      //   selector: (row) =>
      //     row?.receipt ? (
      //       <Tooltip title="View Receipt">
      //         <Button size="small" onClick={() => handleImageOpen(row.receipt)}>
      //           <VisibilityIcon fontSize="small" />
      //         </Button>
      //       </Tooltip>
      //     ) : (
      //       <Typography variant="body2" sx={{ color: "#999" }}>
      //         -
      //       </Typography>
      //     ),
      //   width: "100px",
      //   center: true,
      // },
      {
        name: "Receipt",
        selector: (row) => (
          <>
            <img src={row?.receipt} alt="dbibifb" />
          </>
        ),
        width: "100px",
        center: true,
      },
      {
        name: "Remark",
        selector: (row) => (
          <Tooltip title={row?.remark}>
            <Typography noWrap>{row?.remark}</Typography>
          </Tooltip>
        ),
        grow: 2,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
      },
      {
        name: "Actions",
        selector: (row, { hoveredRow, enableActionsHover }) => {
          if (user?.role !== "adm") return null;
          const isHovered = enableActionsHover && hoveredRow === row.id;
          return (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
              width="120px"
            >
              {isHovered &&
                row.status !== "approved" &&
                row.status !== "rejected" && (
                  <Box display="flex" gap={1}>
                    <Tooltip title="Approve">
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleOpen(row, "approved")}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleOpen(row, "rejected")}
                      >
                        <CancelIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                  </Box>
                )}
              {isHovered && row.status === "rejected" && (
                <Tooltip title="Reopen">
                  <Button
                    size="small"
                    color="warning"
                    onClick={() => handleOpen(row, "reopen")}
                  >
                    <OpenInFullIcon fontSize="small" />
                  </Button>
                </Tooltip>
              )}
              {!isHovered && (
                <Typography variant="body2" sx={{ color: "#999" }}>
                  -
                </Typography>
              )}
            </Box>
          );
        },
        width: "120px",
      },
    ],
    [user]
  );

  const filters = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        type: "dropdown",
        options: [
          { value: "success", label: "Success" },
          { value: "refund", label: "Refund" },
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
        ],
        defaultValue: "pending",
      },
    ],
    []
  );

  return (
    <Box>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_FUND_REQUESTS}
        filters={filters}
        onFetchRef={handleFetchRef}
        enableActionsHover={true}
        customHeader={
          user?.role !== "sadm" &&
          user?.role !== "adm" && (
            <ReButton
              variant="contained"
              label="Request"
              onClick={() => setOpenCreate(true)}
            />
          )
        }
      />

      {openImage && (
        <Modal open={openImage} onClose={() => setOpenImage(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              p: 2,
              borderRadius: 2,
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          >
            <Typography variant="h6" mb={2}>
              Receipt
            </Typography>
            <img
              src={imageSrc}
              alt="Receipt"
              style={{ width: "100%", borderRadius: 8, maxHeight: "80vh" }}
              onError={(e) => {
                console.error("Failed to load image:", imageSrc);
                e.target.src = ""; // fallback
              }}
            />
          </Box>
        </Modal>
      )}

      {/* Create Fund Request */}
      <CreateFundRequest
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        handleSave={handleSaveCreate}
        onFetchRef={refreshUsers}
      />

      {/* Approve / Reject / Reopen modal */}
      {openModal && (
        <FundRequestModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          row={selectedRow}
          status={status}
          onFetchRef={refreshUsers}
        />
      )}
    </Box>
  );
};

export default FundRequest;

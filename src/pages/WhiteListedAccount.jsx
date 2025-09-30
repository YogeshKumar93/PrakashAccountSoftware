import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { Tooltip, IconButton, Box, Typography } from "@mui/material";
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
import CreateEditWhiteListedAccountModal from "../components/Risks/CreateEditWhiteListedAccountModal";
import DeleteRiskAccount from "../components/Risks/DeleteRiskAccount";

const WhiteListedAccount = ({ filters = [] }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false); 
  const [selectedRow, setSelectedRow] = useState(null);

  const [loading, setLoading] = useState(true);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  const fetchBanksRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchBanksRef.current = fetchFn;
  };

  const refreshBanks = () => {
    fetchBanksRef.current?.();
  };

  const handleStatement = (row) => {
    navigate(`/admin/bankstatements/${row.id}`, {
      state: {
        bank_id: row.id,
        bank_name: row.bank_name,
        balance: row.balance,
      },
    });
  };

  // ✅ delete handler
  const handleDelete = (row) => {
    setDeleteRow(row);
    setDeleteOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "Date",
        selector: (row) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
              <span>
                {ddmmyy(row.created_at)} {dateToTime1(row.created_at)}
              </span>
            </Tooltip>
            <Tooltip title={`Updated: ${ddmmyyWithTime(row.updated_at)}`} arrow>
              <span>
                {ddmmyy(row.updated_at)} {dateToTime1(row.updated_at)}
              </span>
            </Tooltip>
          </div>
        ),
        wrap: true,
        width: "140px",
      },

      {
        name: "Account Number",
        selector: (row) => (
          <Tooltip title={row.acc_no}>
            <div style={{ textAlign: "left" }}>{row.acc_no}</div>
          </Tooltip>
        ),
        wrap: true,
      },

      {
        name: "Limit",
        selector: (row) => (
          <div style={{ color: "green", fontWeight: "600", textAlign: "left" }}>
            ₹ {parseFloat(row.limit).toFixed(2)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Actions",
        selector: (row) => (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  setSelectedRow(row);
                  setOpenModal(true); // edit mode
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            {user?.role === "adm" && (
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(row)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
        width: "120px",
        center: true,
      },
    ],
    [user]
  );

  return (
    <>
      <CommonLoader loading={loading} text="Loading Banks" />

      {!loading && (
        <>
          <CommonTable
            onFetchRef={handleFetchRef}
            columns={columns}
            endpoint={ApiEndpoints.GET_WHITE_LISTED_ACCOUNT}
            filters={filters}
            customHeader={
              <ReButton
                label="Add Account"
                onClick={() => {
                  setSelectedRow(null); // create mode
                  setOpenModal(true);
                }}
              />
            }
          />

          {openModal && (
            <CreateEditWhiteListedAccountModal
              open={openModal}
              onClose={() => setOpenModal(false)}
              onFetchRef={refreshBanks}
              initialData={selectedRow}
            />
          )}

          {deleteOpen && (
            <DeleteRiskAccount
              open={deleteOpen}
              handleClose={() => setDeleteOpen(false)}
              selectedRow={deleteRow}
              onFetchRef={refreshBanks}
              endpoint={ApiEndpoints.DELETE_WHITE_LISTED_ACCOUNT}
              title="Delete White-Listed Account"
              field="acc_no"
            />
          )}
        </>
      )}
    </>
  );
};

export default WhiteListedAccount;

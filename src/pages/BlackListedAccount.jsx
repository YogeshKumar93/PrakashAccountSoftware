import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { Tooltip, IconButton, Box, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
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
import CreateBlackListedAccountModal from "../components/Risks/CreateBlackListedAccounts";
import CreateEditBlackListedAccountModal from "../components/Risks/CreateBlackListedAccounts";
import DeleteRiskAccount from "../components/Risks/DeleteRiskAccount";

const BlackListedAccount = ({ filters = [] }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();

  // Modal state: data null → create, data object → edit
  const [modalState, setModalState] = useState({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, row: null });
  const [loading, setLoading] = useState(true);

  const fetchBanksRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchBanksRef.current = fetchFn;
  };

  const refreshBanks = () => {
    if (fetchBanksRef.current) {
      fetchBanksRef.current();
    }
  };

  const handleDelete = (row) => {
    setDeleteModal({ open: true, row });
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (row = null) => setModalState({ open: true, data: row });
  const closeModal = () => setModalState({ open: false, data: null });

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
        name: "Handled By",
        selector: (row) => (
          <div style={{ textAlign: "left", fontWeight: 500 }}>
            {row.handled_by}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Actions",
        selector: (row) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              minWidth: "120px",
            }}
          >
            <Tooltip title="Edit">
              <IconButton
                size="small"
                color="primary"
                onClick={() => openModal(row)}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            {user?.role === "adm" ||
              (user?.role === "sadm" && (
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(row)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ))}
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
      <CommonLoader loading={loading} text="Loading" />

      {!loading && (
        <>
          <CommonTable
            onFetchRef={handleFetchRef}
            columns={columns}
            endpoint={ApiEndpoints.GET_BLACK_LISTED_ACCOUNT}
            filters={filters}
            customHeader={
              <ReButton label="Add Account" onClick={() => openModal()} />
            }
          />

          {modalState.open && (
            <CreateEditBlackListedAccountModal
              open={modalState.open}
              onClose={closeModal}
              onFetchRef={refreshBanks}
              initialData={modalState.data}
            />
          )}

          {deleteModal.open &&
            (user?.role === "adm" || user?.role === "sadm") && (
              <DeleteRiskAccount
                open={deleteModal.open}
                handleClose={() => setDeleteModal({ open: false, row: null })}
                selectedRow={deleteModal.row}
                onFetchRef={refreshBanks}
                endpoint={ApiEndpoints.DELETE_BLACK_LISTED_ACCOUNT}
                title="Delete White-Listed Account"
                field="acc_no"
              />
            )}
        </>
      )}
    </>
  );
};

export default BlackListedAccount;

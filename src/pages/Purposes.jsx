import { useMemo, useContext, useState, useRef } from "react";
import {
  Box,
  Button,
  Tooltip,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import CreateServiceModal from "../components/CreateServiceModal";
import EditServiceModal from "../components/EditServiceModaL";
import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";
import { Lock, LockOpen } from "@mui/icons-material";
import BlockUnblockService from "./BlockUnblockService";
import CreatePurpose from "../components/CreatePurpose";
const Purposes = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [openMpinModal, setOpenMpinModal] = useState(false);
  const [actionType, setActionType] = useState(null); // "block" or "unblock"

  const handleLockUnlockClick = (service, action) => {
    setSelectedService(service);
    setActionType(action);
    setOpenMpinModal(true);
  };

  const fetchUsersRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };
  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };
  const columns = useMemo(
    () => [
      {
        name: "Id",
        selector: (row) => (
          <Tooltip title={row?.id}>
            <div style={{ textAlign: "left" }}>{row?.id}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Type",
        selector: (row) => (
          <Tooltip title={row?.type}>
            <div style={{ textAlign: "left" }}>{row?.type}</div>
          </Tooltip>
        ),
        width: "150px",
      },
    ],
    []
  );

  const filters = useMemo(() => [], []);

  return (
    <Box>
      {/* Services Table */}
      <CommonTable
        onFetchRef={handleFetchRef}
        columns={columns}
        endpoint={ApiEndpoints.GET_PURPOSES}
        filters={filters}
        queryParam={query}
        customHeader={
          (user?.role !== "sadm" || user?.role !== "adm") && (
            <ReButton
              variant="contained"
              label="Purpose"
              onClick={() => setOpenCreate(true)}
            ></ReButton>
          )
        }
      />

      {/* Create Service Modal */}
      <CreatePurpose
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onFetchRef={refreshUsers}
      />
    </Box>
  );
};
export default Purposes;

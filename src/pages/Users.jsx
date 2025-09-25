import { useMemo, useContext, useState, useRef, useEffect } from "react";
import { Box, Tooltip, IconButton, Button, Typography } from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import PermissionsModal from "./PermissionsModal";
import SettingsIcon from "@mui/icons-material/Settings";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BlockUnblockUser from "./BlockUnblockUser";
import ReButton from "../components/common/ReButton";
import CreateUser from "../components/User/createUser";
import EditIcon from "@mui/icons-material/Edit";
import { apiCall } from "../api/apiClient";
const roleLabels = {
  ret: "Retailer",
  adm: "Admin",
  sadm: "Super Admin",
  di: "Distributor",
  asm: "Asm",
  zsm: "Zsm",
  api: "Api",
};
const Users = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const fetchUsersRef = useRef(null);
  const userRole = authCtx?.user;
  const [selectedUser, setSelectedUser] = useState(null);
  const [openPermissions, setOpenPermissions] = useState(false);
  const [userMap, setUserMap] = useState({}); // id → name map

  // 🔐 Lock/Unlock Modal
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const [openCreateUser, setOpenCreateUser] = useState(false);

  const handleOpenPermissions = (user) => {
    setSelectedUser(user);
    setOpenPermissions(true);
  };

  const handleClosePermissions = () => {
    setSelectedUser(null);
    setOpenPermissions(false);
  };

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };

  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };

  const handleOpenLockModal = (user) => {
    setUserToToggle(user);
    setLockModalOpen(true);
  };

  const handleCloseLockModal = () => {
    setUserToToggle(null);
    setLockModalOpen(false);
  };

  const handleEdit = (user) => {
    // Implement edit functionality here
    console.log("Edit user:", user);
  };

  useEffect(() => {
    const fetchUserMap = async () => {
      try {
        const res = await apiCall("post", ApiEndpoints.GET_USERS);
        console.log("Full API response:", res);

        const usersArray = res?.response?.data?.data;
        if (Array.isArray(usersArray)) {
          const map = {};
          usersArray.forEach((user) => {
            console.log("Mapping user:", user.id, user.name); // Debug each user
            map[user.id] = user.name;
          });

          console.log("Final ID → Name map:", map); // Check final mapping
          setUserMap(map);
        } else {
          console.warn("Users array is missing or not an array", usersArray);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUserMap();
  }, []);

  const filters = useMemo(
    () => [
      { id: "mobile", label: "Mobile Number", type: "textfield" },
      { id: "id", label: "User Id", type: "textfield" },
      { id: "Parent", label: "Parent", type: "textfield" },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        name: "Date/Time",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
        ),
      },
      {
        name: "Id",
        selector: (row) => (
          <Tooltip title={row?.id}>
            <div style={{ textAlign: "left" }}>Trans_{row?.id}</div>
          </Tooltip>
        ),
      },
      {
        name: "Name",
        selector: (row) => (
          <Tooltip title={row?.name}>
            <div style={{ textAlign: "left" }}>{row?.name}</div>
          </Tooltip>
        ),
      },
         {
        name: "Establishment",
        selector: (row) => (
          <Tooltip title={row?.establishment}>
            <div style={{ textAlign: "left" }}>{row?.establishment}</div>
          </Tooltip>
        ),
        width: "100px",
      },
          {
        name: "Role",
        selector: (row) => (
          <Tooltip title={roleLabels[row?.role] || row?.role}>
            <div style={{ textAlign: "left" }}>
              {roleLabels[row?.role] || row?.role}
            </div>
          </Tooltip>
        ),
      },
      {
        name: "Mobile",
        selector: (row) => (
          <Tooltip title={row?.mobile}>
            <div style={{ textAlign: "left" }}>{row?.mobile}</div>
          </Tooltip>
        ),
        width: "100px",
      },
      {
        name: "Parent",
        selector: (row) => {
          const parentName = userMap[row.parent] || "-"; // Lookup parent name from userMap
          return (
            <Tooltip title={parentName}>
              <div style={{ textAlign: "left", cursor: "pointer" }}>
                {row.parent}
              </div>
            </Tooltip>
          );
        },
      },
      {
        name: "Status",
        selector: (row, { hoveredRow, enableActionsHover }) => {
          

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: "120px",
              }}
            >
              {/* Status text */}
              <Typography
                sx={{
                  color: row.is_active === 1 ? "green" : "red",
                  minWidth: "60px", // Reserve space
                }}
              >
                {row.is_active === 1 ? "Active" : "Inactive"}
              </Typography>

              {/* Lock icon container */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  opacity:  1 , // fade effect
                  pointerEvents:  "auto" ,  
                  transition: "opacity 0.2s ease-in-out",
                  minWidth: "40px", // reserve space
                }}
              >
                {row.is_active === 1 ? (
                  <Tooltip title="Click to Block">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenLockModal(row)}
                      sx={{ color: "success.main" }}
                    >
                      <LockOpenIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to Unblock">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenLockModal(row)}
                      sx={{ color: "error.main" }}
                    >
                      <LockOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

            
            </Box>
          );
        },
      },
{
        name: "Wallet 1",
        selector: (row) => {
          const parentName = userMap[row.parent] || "-"; // Lookup parent name from userMap
          return (
            <Tooltip title={parentName}>
              <div style={{ textAlign: "left", cursor: "pointer" }}>
                {row.w1}
              </div>
            </Tooltip>
          );
        },
      },
      {
        name: "Wallet 2",
        selector: (row) => {
          const parentName = userMap[row.parent] || "-"; // Lookup parent name from userMap
          return (
            <Tooltip title={parentName}>
              <div style={{ textAlign: "left", cursor: "pointer" }}>
                {row.w2}
              </div>
            </Tooltip>
          );
        },
      },
      {
        name: "Wallet 3",
        selector: (row) => {
          const parentName = userMap[row.parent] || "-"; // Lookup parent name from userMap
          return (
            <Tooltip title={row.w3}>
              <div style={{ textAlign: "left", cursor: "pointer" }}>
                {row.w3}
              </div>
            </Tooltip>
          );
        },
      },
      {
        name: "Lien",
        selector: (row) => {
          const parentName = userMap[row.lien] || "-"; // Lookup parent name from userMap
          return (
            <Tooltip title={row.lien}>
              <div style={{ textAlign: "left", cursor: "pointer" }}>
                {row.lien}
              </div>
            </Tooltip>
          );
        },
      },
      {
        name: "Actions",
        selector: (row, { hoveredRow, enableActionsHover }) => {
          

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "100px", // Fixed width to prevent table shift
              }}
            >
              {/* Buttons always take space; just change opacity */}

              {userRole.role == "adm" && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    opacity:   1 ,
                    pointerEvents:   "auto"  ,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <Tooltip title="Edit User">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleEdit(row)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Permissions">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenPermissions(row)}
                    >
                      <SettingsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

           
            </Box>
          );
        },
      },
    ],
    [userMap]
  );

  return (
    <Box>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_USERS}
        filters={filters}
        queryParam={query}
        onFetchRef={handleFetchRef}
        enableActionsHover={true}
        customHeader={
          <ReButton label="Add User" onClick={() => setOpenCreateUser(true)} />
        }
      />

      {openCreateUser && (
        <CreateUser
          open={openCreateUser}
          onClose={() => setOpenCreateUser(false)}
          onFetchRef={refreshUsers}
        />
      )}

      {/* Permissions Modal */}
      {selectedUser && (
        <PermissionsModal
          open={openPermissions}
          handleClose={handleClosePermissions}
          user={selectedUser}
          onFetchRef={refreshUsers}
        />
      )}

      {/* Lock/Unlock Modal */}
      {userToToggle && (
        <BlockUnblockUser
          open={lockModalOpen}
          handleClose={handleCloseLockModal}
          user={userToToggle}
          onSuccess={refreshUsers}
        />
      )}
    </Box>
  );
};

export default Users;

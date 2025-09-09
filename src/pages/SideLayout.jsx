import React, { useContext, useMemo, useRef, useState } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import { ddmmyy, dateToTime } from "../utils/DateUtils";
import ApiEndpoints from "../api/ApiEndpoints";

import ReButton from "../components/common/ReButton";
import CommonModal from "../components/common/CommonModal";
import CommonTable from "../components/common/CommonTable";

const SideLayout = () => {
  const [openCreate, setOpenCreate] = useState(false);

  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const fetchUsersRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };

  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };

  const handleSaveCreate = () => {
    setOpenCreate(false);
    refreshUsers(); // refresh table after saving
  };

  const columns = (
    () => [
      {
        name: "Date/Time",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Name",
        selector: (row) => (
          <Tooltip title={row?.name}>
            <div style={{ textAlign: "left" }}>{row?.name}</div>
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
        wrap: true,
      },
    ],
    []
  );

  return (
    <Box sx={{}}>
      <CommonTable
        onFetchRef={handleFetchRef}
        columns={columns}
        // endpoint={ApiEndpoints.GET_COLOURS}
        filters={[]}
        queryParam={{}}
        Button={Button}
        customHeader={
          <ReButton
            variant="contained"
            label="Layout"
            onClick={() => setOpenCreate(true)}
          />
        }
      />
    </Box>
  );
};

export default SideLayout;

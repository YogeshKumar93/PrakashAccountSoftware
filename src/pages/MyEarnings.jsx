import {
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { useCallback } from "react";
import { useState } from "react";
import Mount from "./Mount";
import { useContext } from "react";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import AuthContext from "../contexts/AuthContext";
const MyEarnings = ({
  isTitle = true,
  fixedHeaderScrollHeight = "",
  isGridStyle = true,
  txnDataDuration,
  handleChange,
}) => {
  const authCtx = useContext(AuthContext);
  const [earnings, setEarnings] = useState([]);
  const [request, setRequest] = useState(false);
  const user = authCtx.user;
  const role = user.role;

  // const getEarning = useCallback(() => {
  //   postJsonData(
  //     ApiEndpoints.MY_EARNINGS,
  //     { type: txnDataDuration },
  //     setRequest,
  //     (res) => {
  //       if (Array.isArray(res.data.data)) setEarnings(res.data.data);
  //       else setEarnings([]);
  //     },
  //     (err) => {
  //       setEarnings([]);
  //     }
  //   );
  // }, [txnDataDuration]);
  // }, [handleChange]);
  // console.log("the myeaninh txnDataDuration",txnDataDuration)
  // console.log("the myeaninh txnDataDuration handleChange",handleChange)
  // useEffect(() => {
  //   getEarning();

  //   return () => {};
  // }, [getEarning]);

  const columns = [
    {
      name: "Service",
      cell: (row) => (
        <Typography sx={{ fontSize: "12px" }}>
          {row.SERVICE.charAt(0).toUpperCase() +
            row.SERVICE.slice(1).toLowerCase()}
        </Typography>
      ),
    },
    {
      name: "Commission",
      cell: (row) => (
        <Typography sx={{ fontSize: "12px" }}>
          {row.COMMISSION.charAt(0).toUpperCase() +
            row.COMMISSION.slice(1).toLowerCase()}
        </Typography>
      ),
    },
    // {
    //   name: "TDS",
    //   cell: (row) => (
    //     <Typography sx={{ fontSize: "12px" }}>
    //       {row.TDS.charAt(0).toUpperCase() + row.TDS.slice(1).toLowerCase()}
    //     </Typography>
    //   ),
    //   omit: role === USER_ROLES.ADMIN,
    // },
  ];

  // const handleChange = (event, newType) => {
  //   setType(newType);
  // };

  const gridItemStyle = {
    height: "auto",
    // padding: "1rem",
    // background: "#fff",

    // borderRadius: "8px",
    // boxShadow:
    //   "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
    ml: { md: 0, xs: 0 },
    mr: { md: 1.9, xs: 0 },
  };

  return (
    <Grid
      container
      sx={{
        // mt: 12,
        mt: 1,
        pr: { xs: 1.3, lg: 0 },
        mb: { xs: 8, lg: 0 },
      }}
    >
      <Grid item xs={12} sx={isGridStyle ? gridItemStyle : ""}>
        {isTitle && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              fontWeight: "500",
              fontSize: "18px",
              mb: 1,
            }}
          >
            <Typography
              component="div"
              sx={{
                fontWeight: "100",
                fontSize: "17px",
                display: "flex",
                alignItems: "center",
                ml: 1,
              }}
            >
              My Earnings
              <CachedOutlinedIcon
                className="ms-2 refresh-purple"
                sx={{ ml: 2, cursor: "pointer", fontSize: "18px" }}
                // onClick={getEarning}
              />
              {/* <RefreshComponent onClick={getEarning} color="#000" /> */}
            </Typography>
            <ToggleButtonGroup
              color="secondary"
              // defaultValue={type}
              // value={type}
              defaultValue={txnDataDuration}
              value={txnDataDuration}
              exclusive
              onChange={handleChange}
              // onChange={(value) => setTxnDataDuration(value)}
              aria-label="value-type"
            >
              <ToggleButton
                size="small"
                value="TODAY"
                sx={{ fontSize: "0.7rem", padding: "4px 8px" }}
              >
                Today
              </ToggleButton>
              <ToggleButton
                size="small"
                value="THIS"
                sx={{ fontSize: "0.7rem", padding: "4px 8px" }}
              >
                This
              </ToggleButton>
              <ToggleButton
                size="small"
                value="LAST"
                sx={{ fontSize: "0.7rem", padding: "4px 8px" }}
              >
                Last
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
        <Mount visible={earnings && earnings?.length > 0}>
          <Grid item xs={12} sx={{ position: "flex" }}>
            {/* <Loader loading={request} /> */}
            {/* <DataTable
              columns={columns}
              data={earnings}
              customStyles={CustomStyles}
              // pagination
              paginationServer={false}
              progressPending={request}
              fixedHeader
              fixedHeaderScrollHeight={fixedHeaderScrollHeight}
              sx={{ marginTop: "3%" }} // Example padding and margin
            /> */}
          </Grid>
        </Mount>
        <Mount visible={earnings && earnings?.length === 0}>
          {/* <NoDataView /> */}
        </Mount>
      </Grid>
    </Grid>
  );
};

export default MyEarnings;

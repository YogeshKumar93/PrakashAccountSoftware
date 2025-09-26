import {
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  LinearProgress,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import { useState } from "react";
import { currencySetter } from "../utils/Currencyutil";
// import useCommonContext from "../store/CommonContext";
import { Icon } from "@iconify/react";
import Mount from "./Mount";
import { useContext } from "react";
import { createFileName, useScreenshot } from "use-react-screenshot";
import { createRef } from "react";
import ProfitabilityModal from "./ProfitabilityModal";
import AuthContext from "../contexts/AuthContext";
let refresh;
// function refreshFunc(setQueryParams, setPushFlag) {
//   setQueryParams("");
//   setPushFlag(true);
//   if (refresh) refresh();
// }
const AsmProductionSaleComponent = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  // const { setPushFlag } = useCommonContext();
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const [showPrimaryData, setShowPrimaryData] = useState(true);
  const [sumData, setSumData] = useState(false);
  // ##### DOWNLOAD SCREENSHOT VARIABLES ########
  const [image, takeScreenshot] = useScreenshot({
    type: "image/png",
    quality: 1.0,
  });

  const download = (
    image,
    { name = "ASM Reports", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  const ref = createRef(null);
  const downloadScreenshot = () => {
    takeScreenshot(ref.current).then(download);
  };

  const columnsAsm = [
    {
      name: "Name",
      selector: (row) => (
        <div
          style={{
            textAlign: "left",
          }}
        >
          {row.name ? row.name : "TOTAL"}
        </div>
      ),
      width: "90px",
      wrap: true,
    },
    {
      name: "Last Month",
      selector: (row) => (
        // <AsmProductSaleModal
        //   name={row.name}
        //   id={row.asm_id}
        //   amount={
        //     row.primaryLast === 0
        //       ? currencySetter(10000000)
        //       : currencySetter(row.primaryLast)
        //   }
        // />
        <Typography sx={{ fontSize: "13px" }}>
          {row.primaryLast === 0
            ? currencySetter(10000000)
            : currencySetter(row.primaryLast)}
        </Typography>
      ),
    },
    {
      name: "This Month",
      selector: (row) => (
        // <AsmProductSaleModal
        //   name={row.name}
        //   id={row.asm_id}
        //   amount={currencySetter(row.primaryThis)}
        // />
        <Typography sx={{ fontSize: "13px" }}>
          {currencySetter(row.primaryThis)}
        </Typography>
      ),
    },
    {
      name: "Today",
      selector: (row) => (
        // <AsmProductSaleModal
        //   name={row.name}
        //   id={row.asm_id}
        //   amount={currencySetter(row.primaryToday)}
        // />
        <Typography sx={{ fontSize: "13px" }}>
          {currencySetter(row.primaryToday)}
        </Typography>
      ),
    },
    {
      name: "Achieved",
      selector: (row) => (
        <div
          style={{
            textAlign: "left",
            width: "70px",
          }}
        >
          <div>
            {Number(
              (parseInt(row.primaryThis) * 100) / parseInt(row.primaryLast)
            ).toFixed(2) + "%"}
          </div>
          <div>
            <LinearProgress
              variant="determinate"
              value={
                Number(
                  (parseInt(row.primaryThis) * 100) / parseInt(row.primaryLast)
                ).toFixed(2) > 100
                  ? 100
                  : Number(
                      (parseInt(row.primaryThis) * 100) /
                        parseInt(row.primaryLast)
                    ).toFixed(2)
              }
            />
          </div>
        </div>
      ),
      width: "75px",
      right: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <section style={{ display: "flex", alignItems: "center" }}>
          <Mount visible={user?.id?.toString() === "1"}>
            <div className="mx-2">
              <ProfitabilityModal
                row={row}
                name={row.name}
                apiKey="asm_id"
                btn={
                  <Icon
                    icon="heroicons-outline:currency-rupee"
                    style={{ fontSize: "24px", color: "#1877F2" }}
                  />
                }
                width="30px"
              />
            </div>
          </Mount>
          {/* <div>
            <AsmProductSaleModal
              name={row.name}
              id={row.asm_id}
              amount={
                <Icon
                  icon="gridicons:stats-up"
                  style={{ fontSize: "24px", color: "#FF474C" }}
                />
              }
              width="30px"
            />
          </div> */}
        </section>
      ),

      right: true,
    },
  ];

  const columnsProd = [
    {
      name: "Services",
      selector: (row) => row.service,
    },
    {
      name: "Last Month",
      selector: (row) => currencySetter(row.Last),
      width: "130px",
    },

    {
      name: "This Month",
      selector: (row) => currencySetter(row.This),
      width: "130px",
    },
    {
      name: "Today",
      selector: (row) => currencySetter(row.Today),
      width: "130px",
    },
    {
      name: "Achieved",
      selector: (row) => (
        <div style={{ width: "100px" }}>
          <div>
            {Number(row.Last) === 0
              ? "0.00%"
              : Number((parseInt(row.This) * 100) / parseInt(row.Last)).toFixed(
                  2
                ) + "%"}
          </div>
          <div>
            <LinearProgress
              variant="determinate"
              value={
                Number((parseInt(row.This) * 100) / parseInt(row.Last)) > 100
                  ? 100
                  : Number(row.Last) === 0
                  ? 0
                  : Number((parseInt(row.This) * 100) / parseInt(row.Last))
              }
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <Grid
      container
      lg={5.4}
      md={12}
      sm={11.8}
      xs={11.2}
      sx={{
        ml: { lg: 1, md: 0, xs: 0 },
        mr: { md: 0, xs: 0 },
        mt: { lg: 0, md: 1, sm: 1, xs: 1 },
        background: "#fff",
        borderRadius: "8px",
        padding: "1rem",
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
      }}
      className="big-screen-box small-screen-box line-chart"
    >
      {/* asm production table */}
      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {showPrimaryData ? "Product Sale Table" : "ASM Primary"}

          <CachedOutlinedIcon
            className="ms-2 refresh-purple"
            sx={{
              transform: "scale(1)",
              transition: "0.5s",
              "&:hover": { transform: "scale(1.2)" },
              ml: 1,
            }}
            // onClick={() => {
            //   refreshFunc(setQuery, setPushFlag);
            // }}
          />
        </Typography>

        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Tooltip title="Download">
            <IconButton sx={{ mx: 2 }} onClick={downloadScreenshot}>
              <Icon
                icon="lucide:download"
                style={{ fontSize: "24px", color: "#1877F2" }}
              />
            </IconButton>
          </Tooltip>

          <FormGroup>
            <FormControlLabel
              sx={{
                mt: { md: 0, sm: 2, xs: 2 },
                mb: { md: 0, sm: 2, xs: 2 },
              }}
              control={
                <Switch
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#000",
                    },
                  }}
                  value={showPrimaryData}
                  defaultChecked={showPrimaryData}
                  onChange={() => setShowPrimaryData(!showPrimaryData)}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: "15px" }}>
                  Product Sale
                </Typography>
              }
            />
          </FormGroup>
        </Grid>
      </Grid>

      {/* <Grid item xs={12} lg={12} sm={12} md={12} sx={{ mt: 0.5 }} ref={ref}>
      <ApiPaginate
        apiEnd={
          showPrimaryData
            ? ApiEndpoints.GET_RET_PROD_SALE
            : ApiEndpoints.ASM_PRODUCTION_SALE_DATA
        }
        columns={showPrimaryData ? columnsProd : columnsAsm}
        apiData={apiData}
        tableStyle={massegetable}
        setApiData={setApiData}
        setSumData={setSumData}
        queryParam={query ? query : ""}
        returnRefetch={(ref) => {
          refresh = ref;
        }}
        ExpandedComponent={null}
        paginateServer={false}
        paginate={false}
      />
    </Grid> */}
    </Grid>
  );
};

export default AsmProductionSaleComponent;

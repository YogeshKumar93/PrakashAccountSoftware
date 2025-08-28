import React from "react";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
// import DeleteBeneficiaryModal from "../modals/DeleteBeneficiaryModal";
// import AccountVerificationModal from "../modals/AccountVerificationModal";
import { capitalize1 } from "../utils/TextUtil";
import { randomColors } from "../theme/setThemeColor";
import VerifiedIcon from "@mui/icons-material/Verified";
import PortBeneficiaries from "../modals/PortBeneficiaries";
import RetMoneyTransferModal from "./RetMoneyTransferModal";
import {
  abhy2,
  airtel2,
  axis2,
  bandhan2,
  bob2,
  bom2,
  canara2,
  cbi2,
  dbs2,
  defbank2,
  hdfc2,
  icici2,
  idbi2,
  idib2,
  indus2,
  jk2,
  kotak2,
  pnb2,
  rbl2,
  sbi2,
  stand2,
  union2,
  yes1,
  yes2,
} from "../iconsImports";
// import CommonMoneyTransferModal from "../modals/CommonMoneyTransferModal";

// import CommonMoneyTransferModal from "../modals/CommonMoneyTransferModal";

const bankImageMapping = {
  SBIN: sbi2, // State Bank of India
  IBKL: idbi2,
  UTIB: axis2,
  HDFC: hdfc2,
  ICIC: icici2,
  KKBK: kotak2,
  BARB: bob2,
  PUNB: pnb2,
  MAHB: bom2,
  UBIN: union2,
  DBSS: dbs2,
  RATN: rbl2,
  YESB: yes2,
  INDB: indus2,
  AIRP: airtel2,
  ABHY: abhy2,
  CNRB: canara2,
  BDBL: bandhan2,
  CBIN: cbi2,
  IDIB: idib2,
  SCBL: stand2,
  JAKA: jk2,
};
const bankBackgroundColors = {
  SBIN: "#F0F8FF", // Light blue for SBI
  IBKL: "#FFEBEE", // Light red for IDBI
  UTIB: "#E8F5E9", // Light green for Axis
  HDFC: "#FFF8E1", // Light yellow for HDFC
  ICIC: "#E3F2FD", // Light blue for ICICI
  KKBK: "#F3E5F5", // Light purple for Kotak
  BARB: "#F9F6EE", // Light red for BOB
  PUNB: "#F5F5DC", // Light green for PNB
  MAHB: "#FBE9E7", // Light orange for BOM
  UBIN: "#F1F8E9", // Light green for Union
  DBSS: "#E1F5FE", // Light cyan for DBS
  RATN: "#FBE9E7", // Light orange for RBL
  AIRP: "#fd5c63",
  YESB: "#fff",
  INDB: "#FAA0A0",
  ABHY: "#0CAFFF",
  CNRB: "#ADD8E6",
  BDBL: "#F0F8FF",
  IDIB: "#A4DDED",
  SCBL: "#ACE1AF",
  JAKA: "#FAF9F6",

  // Add more mappings as required
};
const BeneCardComponent = ({
  ben,
  index,
  type,
  mobile,
  remitterStatus,
  getRemitterStatus,
  view,
}) => {
  const bankCode = ben?.ifsc?.slice(0, 4).toUpperCase();

  // Get the corresponding bank image or use a default
  const bankLogo = bankImageMapping[bankCode] || defbank2;
  const backgroundColor = bankBackgroundColors[bankCode] || "##000"; // Default white

  return (
    <Box
      className="card1-css"
      key={index}
      sx={{
        display: "flex",
        flexDirection: { lg: "row", sm: "column" },
        px: 2,
        py: 1.3,
        ml: 6,
        mr: 6,
        mt: 1,
        position: "relative",
        gap: 2,
        borderRadius: "8px",
        // boxShadow: "0.5px 0.5px 0.5px 0.5px rgb(214, 187, 251)",
        border: "0.25px solid #D6BBFB",
        // Minimal shadow for compact design
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row", // Keeping the items in a row
          gap: 2, // Reduced gap between items for compact design
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%", // Ensure the Box takes full width
        }}
      >
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        
            backgroundColor: backgroundColor,
            // background:"#1877F2",
            borderRadius: "6px",
            height: "64px", // Avatar size
            width: "64px", // Avatar size
            p: 2, // Padding inside the avatar
          }}
        >
     
          <img
            src={bankLogo}
            alt="Bank Logo"
            style={{ width: "40px", height: "40px" }}
          />
        </Grid>

        <Grid
          container
          spacing={2} // Ensure spacing between the Grid items
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%", // Make sure it spans full width
            flexGrow: 1,
          }}
        >
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <Typography sx={{ textAlign: "left", fontWeight: "600" }}>
              Name
            </Typography>
            <Typography
              sx={{
                fontWeight: "500",
                textAlign: "left",
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}
            >
              {ben?.name ? capitalize1(ben?.name) : capitalize1(ben?.bene_name)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <Typography sx={{ textAlign: "left", fontWeight: "600" }}>
              Account No
            </Typography>
            <Typography
              sx={{
                fontWeight: "500",
                textAlign: "left",
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}
            >
              {ben?.bene_acc || ben?.accno}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <Typography sx={{ fontWeight: "600", textAlign: "left" }}>
              IFSC
            </Typography>
            <Typography
              sx={{
                textAlign: "left",
                fontWeight: "500",
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}
            >
              {ben?.ifsc}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row", // Stack buttons vertically
          justifyContent: "space-between",
          gap: 1.5,
          alignItems: "center",
          ml: 1, // Small margin for separation
        }}
      >
 
        <Box sx={{ display: "flex", gap: 1 }}>
          {ben.last_success_date ? (
            <>
              <Typography sx={{ color: "#006400" }}>Verified</Typography>
              <VerifiedIcon
                sx={{ fontSize: "17px", color: "#006400", mr: 0.5 }}
              />
            </>
          ) : (
            ""
            // <AccountVerificationModal
            //   ben={ben}
            //   rem_number={mobile}
            //   remitterStatus={remitterStatus}
            //   getRemitterStatus={getRemitterStatus}
            //   dmtValue={type}
            // />
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* <RetMoneyTransferModal */}
          {/* <CommonMoneyTransferModal
            dmtValue={type}
            type="NEFT"
            ben={ben}
            rem_number={mobile && mobile}
            rem_details={remitterStatus}
            apiEnd={
              type === "dmt1"
                ? ApiEndpoints.DMR_MONEY_TRANSFER
                : ApiEndpoints.DMT2_MT
            }
            view="Money Transfer"
            limit_per_txn={
              remitterStatus.limitPerTransaction
                ? remitterStatus.limitPerTransaction
                : 5000
            }
            remDailyLimit={remitterStatus?.limitDetails?.availableDailyLimit}
          /> */}
          {/* <RetMoneyTransferModal */}
          {/* <CommonMoneyTransferModal
            dmtValue={type}
            type="IMPS"
            ben={ben}
            rem_number={mobile && mobile}
            rem_details={remitterStatus}
            apiEnd={
              type === "dmt1"
                ? ApiEndpoints.DMR_MONEY_TRANSFER
                : ApiEndpoints.DMT2_MT
            }
            view="Money Transfer"
            limit_per_txn={
              remitterStatus.limitPerTransaction
                ? remitterStatus.limitPerTransaction
                : 5000
            }
          /> */}
        </Box>

        {/* <Box sx={{ position: "absolute", top: "-10px", right: "-10px" }}>
          <DeleteBeneficiaryModal
            dmtValue={type}
            bene={ben}
            mob={mobile && mobile}
            getRemitterStatus={getRemitterStatus}
            apiEnd={
              type === "dmt1"
                ? ApiEndpoints.REMOVE_BENE
                : ApiEndpoints.DMT2_REM_BENE
            }
            view="moneyTransfer"
          />
        </Box> */}
      </Box>
    </Box>
  );
};
export default BeneCardComponent;

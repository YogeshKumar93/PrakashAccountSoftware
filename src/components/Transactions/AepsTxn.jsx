import { useMemo, useCallback, useContext, useState } from "react";
import {
  Box,
  Tooltip,
  Typography,
  Button,
  Drawer,
  IconButton,
} from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

import biggpayLogo from "../../assets/Images/PPALogor.png";
import TransactionDetailsCard from "../common/TransactionDetailsCard";
import { android2, linux2, macintosh2, windows2 } from "../../iconsImports";
import { okhttp } from "../../utils/iconsImports";
import LaptopIcon from "@mui/icons-material/Laptop";
import PrintIcon from "@mui/icons-material/Print";
import { Navigate, useNavigate } from "react-router-dom";

const AepsTxn = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();
  const filters = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        type: "dropdown",
        options: [
          { value: "success", label: "Success" },
          { value: "failed", label: "Failed" },
          { value: "refund", label: "Refund" },
          { value: "pending", label: "Pending" },
        ],
        defaultValue: "pending",
      },
      // { id: "customer_mobile", label: "Customer Mobile", type: "textfield" },
      { id: "txn_id", label: "Txn ID", type: "textfield" },
      { id: "route", label: "Route", type: "textfield", roles: ["admin"] },
      {
        id: "client_ref",
        label: "Client Ref",
        type: "textfield",
        roles: ["admin"],
      },
    ],
    []
  );
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
        width: "190px",
      },
      {
        name: "Route",
        selector: (row) => (
          <div style={{ fontSize: "10px", fontWeight: "600" }}>{row.route}</div>
        ),
        center: true,
        width: "70px",
      },
      {
        name: "Pf",
        selector: (row) => {
          let icon;

          if (row.pf.toLowerCase().includes("windows")) {
            icon = (
              <img
                src={windows2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("android")) {
            icon = (
              <img
                src={android2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("mac")) {
            icon = (
              <img
                src={macintosh2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("linux")) {
            icon = (
              <img
                src={linux2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("okhttp")) {
            icon = (
              <img
                src={okhttp}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else {
            icon = <LaptopIcon sx={{ color: "blue", width: "22px" }} />;
          }

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                textAlign: "justify",
                gap: 2,
              }}
            >
              {icon}
            </Box>
          );
        },
        width: "20px",
        wrap: true,
        left: true,
      },
      ...(user?.role === "ret" || user?.role === "dd"
        ? [] // ❌ hide for ret and dd
        : [
            {
              name: "Txn ID /Ref",
              selector: (row) => (
                <div
                  style={{
                    textAlign: "left",
                    fontSize: "10px",
                    fontWeight: "600",
                  }}
                >
                  {row.txn_id}
                  <br />
                  {row.client_ref}
                </div>
              ),
              wrap: true,
              width: "100px",
            },
          ]),
      ...(user?.role === "ret" || user?.role === "dd"
        ? []
        : [
            {
              name: "Est.",
              selector: (row) => (
                <div style={{ fontSize: "10px", fontWeight: "600" }}>
                  {row.establishment}
                </div>
              ),
              center: true,
              width: "70px",
            },
          ]),

      ...(user?.role === "adm"
        ? []
        : [
            {
              name: "TxnId",
              selector: (row) => (
                <div
                  style={{
                    textAlign: "left",
                    fontSize: "10px",
                    fontWeight: "600",
                  }}
                >
                  {row.txn_id}
                  <br />
                  {/* {row.client_ref} */}
                </div>
              ),
              wrap: true,
              width: "100px",
            },
          ]),
      {
        name: "Aadhaar No.",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            **** **** {row.aadhaar_number.slice(-4)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Service",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>{row.operator}</div>
        ),
        wrap: true,
      },
      // {
      //   name: "Bank / IIN",
      //   selector: (row) => (
      //     <div style={{ textAlign: "left" }}>
      //       {row.bank_name?.toUpperCase()} <br /> {row.iin}
      //     </div>
      //   ),
      //   wrap: true,
      // },
      {
        name: "Txn Type",
        selector: (row) => (
          <div style={{ fontWeight: 500, textAlign: "center" }}>
            {row.txn_type}
          </div>
        ),
        center: true,
      },
      {
        name: "Amount",
        selector: (row) => (
          <div style={{ color: "green", fontWeight: 600, textAlign: "right" }}>
            ₹ {parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        right: true,
      },
      {
        name: " RetComm / Tds",
        selector: (row) => (
          <div
            style={{ textAlign: "right", fontSize: "10px", fontWeight: 600 }}
          >
            <div style={{ color: "green" }}>
              {parseFloat(row.ret_comm).toFixed(2)}
            </div>
            <div style={{ color: "blue" }}>
              {parseFloat(row.ret_tds).toFixed(2)}
            </div>
          </div>
        ),
        right: true,
        width: "60px",
      },
      ...(user?.role === "adm"
        ? [
            {
              name: "Di Comm/ tds",
              selector: (row) => (
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "10px",
                    fontWeight: 600,
                  }}
                >
                  <div style={{ color: "green" }}>
                    {parseFloat(row.di_comm).toFixed(2)}
                  </div>
                  <div style={{ color: "blue" }}>
                    {parseFloat(row.di_tds).toFixed(2)}
                  </div>
                </div>
              ),
              right: true,
              width: "60px",
            },
            {
              name: "Md Comm/ tds",
              selector: (row) => (
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "10px",
                    fontWeight: 600,
                  }}
                >
                  <div style={{ color: "green" }}>
                    {parseFloat(row.md_comm).toFixed(2)}
                  </div>
                  <div style={{ color: "blue" }}>
                    {parseFloat(row.md_tds).toFixed(2)}
                  </div>
                </div>
              ),
              right: true,
              width: "60px",
            },
          ]
        : []),

      {
        name: "Balance",
        selector: (row) => (
          <div style={{ textAlign: "right", fontWeight: 600 }}>
            ₹ {parseFloat(row.balance).toFixed(2)}
          </div>
        ),
        right: true,
      },
      {
        name: "RRN",
        selector: (row) => <div style={{ textAlign: "center" }}>{row.rrn}</div>,
        center: true,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,

        center: true,
      },
      {
        name: "View",
        selector: (row) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "80px",
              gap: 1, // space between icons
            }}
          >
            {/* View Transaction visible to all */}
            <Tooltip title="View Transaction">
              <IconButton
                color="info"
                onClick={() => {
                  setSelectedRow(row);
                  setDrawerOpen(true);
                }}
                size="small"
                sx={{ backgroundColor: "transparent" }}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            {/* Print Aeps visible only to ret and dd */}
            {(user?.role === "ret" || user?.role === "dd") && (
              <Tooltip title="Print Aeps">
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() =>
                    navigate("/print-aeps", { state: { txnData: row } })
                  }
                  sx={{ backgroundColor: "transparent" }}
                >
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
        width: "100px",
        center: true,
      },
    ],
    []
  );

  const queryParam = "";

  return (
    <>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_AEPS_TXN}
        filters={filters}
        queryParam={queryParam}
        enableActionsHover={true}
      />

      {/* AEPS Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {selectedRow && (
            <TransactionDetailsCard
              amount={selectedRow.amount}
              status={selectedRow.status}
              onClose={() => setDrawerOpen(false)} // ✅ Close drawer
              companyLogoUrl={biggpayLogo}
              dateTime={ddmmyyWithTime(selectedRow.created_at)}
              message={selectedRow.message || "No message"}
              details={[
                { label: "Txn ID", value: selectedRow.txn_id },
                { label: "Client Ref", value: selectedRow.client_ref },
                { label: "Sender Mobile", value: selectedRow.sender_mobile },
                {
                  label: "Beneficiary Name",
                  value: selectedRow.beneficiary_name,
                },
                { label: "Account Number", value: selectedRow.account_number },
                { label: "IFSC Code", value: selectedRow.ifsc_code },
                { label: "Bank Name", value: selectedRow.bank_name },
                { label: "Route", value: selectedRow.route },
                { label: "Charge", value: selectedRow.ccf },
                { label: "GST", value: selectedRow.gst },
                { label: "Commission", value: selectedRow.comm },
                { label: "TDS", value: selectedRow.tds },
              ]}
              onRaiseIssue={() => {
                setSelectedTxn(selectedRow.txn_id);
                setOpenCreate(true);
              }}
            />
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default AepsTxn;

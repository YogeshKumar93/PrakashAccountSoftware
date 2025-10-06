import React, { useEffect, useState } from "react";
import CommonModal from "../components/common/CommonModal";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonLoader from "../components/common/CommonLoader";
import { useToast } from "../utils/ToastContext";

const ALLOWED_SECTIONS = ["basic", "address", "kyc"];
const EXCLUDE_KEYS = ["id", "user_id", "created_at", "updated_at"];
const DOCUMENT_KEYS = [
  "gst_certificate",
  "udyam_certificate",
  "shop_license",
  "rent_agreement",
  "electricity_bill",
];

const ViewDocuments = ({ open, onClose, user }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [zoomImage, setZoomImage] = useState(null); // for zoom modal
  const { showToast } = useToast();

  useEffect(() => {
    if (open && user?.id) fetchUserData();
  }, [open, user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_ALL_BY_USER,
        { id: user.id }
      );
      setUserData(response?.data || {});
    } catch (err) {
      console.error(err);
      setUserData({});
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    setActionLoading(true);
    try {
      const payload = { user_id: user.id, action };
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.APPROVE_REJECT_DOCS,
        payload
      );

      if (response) {
        showToast(response?.message, "success");
        onClose();
      } else {
        showToast(error?.message, "error");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing action");
    } finally {
      setActionLoading(false);
    }
  };

  const renderField = (key, value) => {
    const formattedKey = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const isImage =
      typeof value === "string" &&
      (value.startsWith("http://") || value.startsWith("https://"));

    return (
      <Box key={key} sx={{ mb: 1, mr: 2 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
          {formattedKey}:
        </Typography>
        {value ? (
          isImage ? (
            <img
              src={value}
              alt={formattedKey}
              onClick={() => setZoomImage(value)}
              style={{
                maxWidth: "120px",
                maxHeight: "120px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginTop: 4,
                cursor: "pointer",
                objectFit: "cover",
                transition: "transform 0.2s",
              }}
            />
          ) : (
            <Typography sx={{ fontSize: 14, display: "inline-block", ml: 1 }}>
              {value}
            </Typography>
          )
        ) : (
          <Typography
            sx={{ fontStyle: "italic", color: "#777", fontSize: 14, ml: 1 }}
          >
            Not Provided
          </Typography>
        )}
      </Box>
    );
  };

  const renderSection = (sectionData = {}, sectionName) => {
    if (!sectionData || Object.keys(sectionData).length === 0) {
      return (
        <Typography sx={{ fontStyle: "italic", color: "#777", fontSize: 14 }}>
          No data available for this section.
        </Typography>
      );
    }

    const textKeys = Object.keys(sectionData).filter(
      (key) => !EXCLUDE_KEYS.includes(key) && !DOCUMENT_KEYS.includes(key)
    );

    const docKeys = Object.keys(sectionData).filter((key) =>
      DOCUMENT_KEYS.includes(key)
    );

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {textKeys.length > 0 &&
          textKeys.map((key) => renderField(key, sectionData[key]))}

        {sectionName === "kyc" && docKeys.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
            {docKeys.map((key) => renderField(key, sectionData[key]))}
          </Box>
        )}
      </Box>
    );
  };

  const sectionEntries = Object.entries(userData).filter(([sectionName]) =>
    ALLOWED_SECTIONS.includes(sectionName)
  );

  return (
    <>
      <CommonModal
        open={open}
        onClose={onClose}
        title={`View Details of ${user?.name}`}
        maxWidth="lg"
        footerButtons={
          user?.status !== 1
            ? [
                {
                  text: "Approve",
                  variant: "contained",
                  color: "success",
                  onClick: () => handleAction("approve"),
                  disabled: actionLoading,
                },
                {
                  text: "Reject",
                  variant: "outlined",
                  color: "error",
                  onClick: () => handleAction("reject"),
                  disabled: actionLoading,
                },
              ]
            : []
        }
      >
        <Box
          sx={{
            position: "relative",
            maxHeight: "70vh",
            overflowX: "auto",
            overflowY: "hidden",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            py: 1,
          }}
        >
          {(loading || actionLoading) && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="rgba(255,255,255,0.6)"
              zIndex={1}
            >
              <CommonLoader />
            </Box>
          )}

          {!loading &&
            sectionEntries.length > 0 &&
            sectionEntries.map(([sectionName, sectionData]) => (
              <Paper
                key={sectionName}
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: "#fafafa",
                  minWidth: "300px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    textTransform: "capitalize",
                    fontSize: 16,
                  }}
                >
                  {sectionName}
                </Typography>
                {renderSection(sectionData, sectionName)}
              </Paper>
            ))}
        </Box>
      </CommonModal>

      {/* Zoom Image Modal */}
      <Dialog
        open={!!zoomImage}
        onClose={() => setZoomImage(null)}
        maxWidth="md"
      >
        <DialogContent sx={{ position: "relative", p: 0 }}>
          <IconButton
            onClick={() => setZoomImage(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              color: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={zoomImage}
            alt="Zoomed"
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewDocuments;

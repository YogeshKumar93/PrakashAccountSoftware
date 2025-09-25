import { Modal, Typography, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AuthContext from "../contexts/AuthContext";
import Mount from "./Mount";
import MyEarnings from "./MyEarnings";
import { currencySetter } from "../utils/Currencyutil";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "100%", md: "50%" },
  height: "100vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  objectFit: "cover",
  p: 3,
  display: "flex",
  flexDirection: "column",
};

const MyEarningsModal = ({ name, users }) => {
  const [open, setOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box
        hidden={!users?.profit}
        sx={{
          fontSize: "12px",
          "&:hover": { cursor: "pointer" },
        }}
        onClick={handleOpen}
      >
        Profit:{" "}
        <span style={{ color: "#00bf78" }}>
          {currencySetter(users?.profit)}
        </span>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/* Custom header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Earnings</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Earnings content */}
          <Mount visible={Number(user.username) === 9999442202}>
            <MyEarnings isTitle={false} isGridStyle={false} />
          </Mount>
        </Box>
      </Modal>
    </>
  );
};

export default MyEarningsModal;

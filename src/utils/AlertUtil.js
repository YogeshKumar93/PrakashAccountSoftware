import React, { useState } from "react";
import { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const AlertUtil = ({
  vis = false,
  setVis,
  msg = "This is a Alert!",
  color = "success",
}) => {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [open, setOpen] = useState(false);
  //   const handleClick = () => {
  //     setOpen(true);
  //   };
  useEffect(() => {
    setOpen(vis.open);
    return () => {};
  }, [vis]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setVis({
      open: false,
      msg: "",
    });
    setOpen(false);
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      // message="Note archived"
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={color} sx={{ width: "100%" }}>
        {vis.msg}
      </Alert>
    </Snackbar>
  );
};

export default AlertUtil;

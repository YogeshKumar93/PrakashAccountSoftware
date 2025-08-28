import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Grid } from "@mui/material";
import ModalHeader from "./ModalHeader";
import { useEffect } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%", // Adjusted the width for better display
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  overflow: "hidden", // Prevent overflow outside the modal
};

const contentStyle = {
  maxHeight: "400px", // Adjust the height to suit your modal content
  overflowY: "auto", // Make the content scrollable vertically
  padding: "10px",  // Optional padding to make it look better
};

const DmrNumberListModal = ({ numberList, setMobile }) => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (numberList && numberList.length > 0) setOpen(true);
  }, [numberList]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Select Number" handleClose={handleClose} />
          <Box sx={contentStyle}>
            <Grid container spacing={2} justifyContent="center">
              {numberList &&
                numberList.map((item, index) => {
                  return (
                    <Grid item xs={12} sm={4} key={index}>
                      <Box
                        style={{
                          textAlign: "center",
                          margin: "12px",
                          cursor: "pointer", // Added to make it clear it's clickable
                        }}
                        onClick={() => {
                          setMobile(item.remitter);
                          handleClose();
                        }}
                        className="card-css light-bkgd"
                      >
                        {item.remitter}
                      </Box>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DmrNumberListModal;

/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Modal,
  Radio,
  RadioGroup,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { currencySetter } from "../utils/Currencyutil";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "45%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 3,
};

const ProfitabilityModal = ({ row, btn, name, width, apiKey }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [profit, setProfit] = useState("");
  const [duration, setDuration] = useState("TODAY");

  const handleOpen = () => {
    setOpen(true);
    getUserProfit();
  };
  const handleClose = () => {
    setOpen(false);
  };

  // const getUserProfit = () => {
  //   postJsonData(
  //     ApiEndpoints.USER_PROFIT,
  //     {
  //       [apiKey]: row.asm_id,
  //       type: duration,
  //     },
  //     setRequest,
  //     (res) => {
  //       setProfit(res?.data?.data);
  //     },
  //     (err) => {
  //       apiErrorToast(err);
  //     }
  //   );
  // };

  // useEffect(() => {
  //   if (open) getUserProfit();
  // }, [duration]);

  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Button
        variant="text"
        size="small"
        sx={{
          fontSize: "12px",
          fontWeight: "normal",
          "&:hover": {
            cursor: "pointer",
          },
          minWidth: width,
        }}
        onClick={handleOpen}
      >
        {btn}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          {/* Inline Header instead of ModalHeader */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              borderBottom: "1px solid #eee",
              pb: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: "16px", fontFamily: "Poppins" }}
            >
              {`${name}'s Profitability Report`}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* <Loader loading={request} /> */}

          <Grid container spacing={2} sx={{ pl: 3 }}>
            <Grid item md={12} sx={{ mt: 2 }}>
              <FormControl>
                <FormLabel id="duration-label">Choose Duration</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="duration-label"
                  name="row-radio-buttons-group"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <FormControlLabel
                    value="TODAY"
                    control={<Radio />}
                    label="Today"
                  />
                  <FormControlLabel
                    value="THIS"
                    control={<Radio />}
                    label="This"
                  />
                  <FormControlLabel
                    value="LAST"
                    control={<Radio />}
                    label="Last"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item md={12} xs={12} sx={{ mt: 1, pl: 1 }}>
              <span
                style={{
                  fontSize: "16px",
                  marginRight: "8px",
                }}
              >
                Profit Amount:
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginRight: "8px",
                }}
              >
                {currencySetter(profit)}
              </span>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfitabilityModal;

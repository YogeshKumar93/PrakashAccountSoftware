// DmrVrifyNewUser Component
const DmrVrifyNewUser = ({
  rem_mobile,
  getRemitterStatus,
  view,
  verifyotp,
  apiEnd,
  otpRefId,
  setOtpRefId,
  setVerifyotp,
  dmtValue,
  dmr2RemRes,
  goBack,
  onClose,
}) => {
  const [open, setOpen] = useState(true);
  const [request, setRequest] = useState(false);
  const [mobile, setMobile] = useState(rem_mobile);
  const authCtx = useContext(AuthContext);
  const { user, location } = authCtx;
  const { lat: userLat, long: userLong } = location;

  useEffect(() => {
    setOpen(true);
  }, [verifyotp]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: "max-content",
    overflowY: "scroll",
    p: 2,
  };

  const handleClose = () => {
    setOpen(false);
    if (setOtpRefId) setOtpRefId("");
    setMobile(null);
    if (setVerifyotp) setVerifyotp(false);
    if (goBack) goBack();
    if (onClose) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const data = {
      otp: form.otp.value,
      ...(view === "expressTransfer"
        ? { rem_number: rem_mobile }
        : { otpReference: otpRefId }),
    };

    const dmt2Data = {
      ekyc_id: dmr2RemRes?.ekyc_id,
      stateresp: dmr2RemRes?.stateresp,
      otp: form.otp.value,
      latitude: userLat,
      mobile: mobile,
      longitude: userLong,
    };

    const endpoint = dmtValue === "express" ? ApiEndpoints.NEW_VALIDATE_OTP : apiEnd;
    const requestData = dmtValue === "dmt2" ? dmt2Data : data;

    const { error, response } = await apiCall("POST", endpoint, requestData);

    if (error) {
      console.error("Error verifying user:", error);
      return;
    }

    if (getRemitterStatus) {
      getRemitterStatus(rem_mobile);
    }
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="sm_modal">
        <Loader loading={request} />
        <Box
          component="form"
          id="add_rem"
          validate
          autoComplete="off"
          onSubmit={handleSubmit}
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
        >
          <Grid container sx={{ pt: 1 }}>
            <Grid item md={12} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  label="Mobile"
                  id="mobile"
                  size="small"
                  required
                  value={mobile}
                  disabled={rem_mobile ? true : false}
                  inputProps={{ maxLength: "10" }}
                  onChange={(e) => {
                    setMobile(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  label="Enter OTP"
                  id="otp"
                  size="small"
                  required
                  inputProps={{ maxLength: 6 }}
                />
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={request}>
              Verify
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DmrVrifyNewUser ;
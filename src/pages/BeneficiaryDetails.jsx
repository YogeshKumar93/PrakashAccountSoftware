import { useState } from "react";
import { Box, Typography, Paper, Radio, RadioGroup, FormControlLabel, TextField } from "@mui/material";

const BeneficiaryDetails = ({ beneficiary }) => {
  const [transferMode, setTransferMode] = useState("IMPS"); // default IMPS
  const [amount, setAmount] = useState("");

  if (!beneficiary) return null;

  return (
    <Paper sx={{ p: 2, mt: 2, borderRadius: 2 }}>
      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
        Selected Beneficiary
      </Typography>
      <Typography variant="body2">Name: {beneficiary.beneficiary_name}</Typography>
      <Typography variant="body2">Account Number: {beneficiary.account_number}</Typography>
      <Typography variant="body2">Bank: {beneficiary.bank_name}</Typography>
      <Typography variant="body2">IFSC: {beneficiary.ifsc_code}</Typography>

      {/* Transfer Mode Radio Buttons */}
      <Box mt={2}>
        <Typography variant="body2" fontWeight="medium" mb={0.5}>
          Transfer Mode
        </Typography>
        <RadioGroup
          row
          value={transferMode}
          onChange={(e) => setTransferMode(e.target.value)}
        >
          <FormControlLabel value="IMPS" control={<Radio />} label="IMPS" />
          <FormControlLabel value="NEFT" control={<Radio />} label="NEFT" />
        </RadioGroup>
      </Box>

      {/* Amount Input */}
      <Box mt={2}>
        <TextField
          label="Amount"
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Box>
    </Paper>
  );
};

export default BeneficiaryDetails;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Fade,
  Zoom
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  AccountBalance as BankIcon,
  Send as SendIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";

export const MoneyTransferForm = ({ 
  beneficiary, 
  transferType, 
  onClose, 
  remitterStatus,
  mobile,
  onTransfer 
}) => {
  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const amountValue = parseFloat(amount) || 0;

  // OTP countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = () => {
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setShowOtpField(true);
      setCountdown(30); // 30 seconds countdown
      alert(`OTP sent to your registered mobile number ending with ${mobile.slice(-4)}`);
    }, 1500);
  };

  const handleTransfer = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log({
        amount: amountValue,
        beneficiary: beneficiary.name || beneficiary.bene_name,
        account: beneficiary.bene_acc || beneficiary.accno,
        ifsc: beneficiary.ifsc,
        otp: otp,
        transferType: transferType,
        timestamp: new Date().toISOString()
      });
      
      alert(`${transferType} transfer of ₹${amount} to ${beneficiary.name || beneficiary.bene_name} completed successfully!`);
      onTransfer();
      onClose();
    }, 1500);
  };

  const handleResendOtp = () => {
    setCountdown(30);
    alert("OTP resent successfully!");
  };

  return (
    <Dialog open={true} onClose={onClose} fullScreen={isMobile} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        background: theme.palette.primary.main, 
        color: 'white',
        display: 'flex',
        alignItems: 'center'
      }}>
        <SecurityIcon sx={{ mr: 1 }} />
        Secure {transferType} Transfer
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Beneficiary Card */}
          <Card sx={{ p: 2, mb: 3, background: theme.palette.grey[50] }} elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                <BankIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {beneficiary.name || beneficiary.bene_name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {beneficiary.bene_acc || beneficiary.accno} • {beneficiary.ifsc}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">From Account</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {remitterStatus?.firstName || remitterStatus?.name} {remitterStatus?.lastName || remitterStatus?.lname}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {mobile}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="textSecondary">Transfer Limit</Typography>
                <Typography variant="body1" fontWeight="medium">
                  ₹{remitterStatus?.limitPerTransaction || 5000}
                </Typography>
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Verified" 
                  size="small" 
                  color="success" 
                  variant="outlined"
                  sx={{ height: 24, mt: 0.5 }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Amount Input */}
          <Zoom in={!showOtpField}>
            <Box>
              <TextField
                fullWidth
                label="Enter Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputProps={{ 
                  min: "1", 
                  max: remitterStatus?.limitPerTransaction || 5000 
                }}
                helperText={`Maximum amount per transaction: ₹${remitterStatus?.limitPerTransaction || 5000}`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="h6" color="primary">₹</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              
              {amountValue > 99 && (
                <Fade in={amountValue > 99}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} /> : <SecurityIcon />}
                      size="large"
                    >
                      {isLoading ? 'Sending OTP...' : 'Verify with OTP'}
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                      OTP required for transactions above ₹100
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Box>
          </Zoom>

          {/* OTP Input */}
          {showOtpField && (
            <Fade in={showOtpField}>
              <Box>
                <TextField
                  fullWidth
                  label="Enter OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  helperText="Enter the 6-digit OTP sent to your registered mobile"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SecurityIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Didn't receive OTP?
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={handleResendOtp}
                    disabled={countdown > 0}
                  >
                    Resend OTP {countdown > 0 ? `(${countdown}s)` : ''}
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" size="large">
          Cancel
        </Button>
        <Button 
          onClick={showOtpField ? handleTransfer : handleSendOtp}
          variant="contained" 
          disabled={isLoading || (showOtpField && !otp)}
          startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
          size="large"
        >
          {isLoading 
            ? 'Processing...' 
            : showOtpField 
              ? 'Complete Transfer' 
              : `Transfer ₹${amount || '0'}`
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};
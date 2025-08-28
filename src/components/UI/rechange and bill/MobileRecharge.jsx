import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ApiEndPoint } from "./common/ApiEndPoint";
import { get, postJsonData } from "./context/ApiController";
import { apiErrorToast, okSuccessToast } from "./utils/ToastUtil";
import UserContext from "./context/UserContext";
import Loader from "./common/Loader";
import PinInput from "./common/PinInput";
import CommenCardBill from "./common/CommenCardBill";
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const MobileRecharge = ({ type }) => {
  const [operators, setOperators] = useState([]);
  const [filteredOperators, setFilteredOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { refreshUser } = useContext(UserContext);
  const [mpin, setMpin] = useState("");
  const [plans, setPlans] = useState([]);
  const [plansDrawerOpen, setPlansDrawerOpen] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);

  // Validation schema
  const schema = yup.object().shape({
    param1: yup
      .string()
      .required("Mobile number is required")
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    param3: yup
      .number()
      .typeError("Amount must be a number")
      .positive("Amount must be positive")
      .required("Amount is required")
      .test(
        "is-decimal",
        "Amount should have maximum 2 decimal places",
        (value) => {
          if (value) {
            return /^\d+(\.\d{1,2})?$/.test(value.toString());
          }
          return true;
        }
      ),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      param1: "",
      param3: "",
    },
  });

  const amountValue = watch("param3");

  // Fetch Mobile Operators from API
  const fetchMobileOperators = () => {
    if (!type) return;

    setLoading(true);
    get(
      `${ApiEndPoint.GET_OPERTEROS}?subType=${type}`,
      "",
      setLoading,
      (res) => {
        const operatorsData = res?.data?.data || [];
        const formattedOperators = operatorsData.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          img: item.img || "/default-operator.png",
          params: {
            param1: item.param1 || "Mobile Number",
            param3: item.param3 || "Amount",
          },
        }));

        setOperators(formattedOperators);
        setFilteredOperators(formattedOperators);
        setLoading(false);
      },
      (err) => {
        apiErrorToast(err);
        setLoading(false);
      }
    );
  };

  // Fetch plans when view plans button is clicked
  const fetchPlans = () => {
    if (!selectedOperator || !amountValue) {
      apiErrorToast("Please select an operator and enter an amount");
      return;
    }
    
    setPlansLoading(true);
    setPlansDrawerOpen(true);
    get(
      `${ApiEndPoint.ADMIN_PLAN}?operator=${selectedOperator.code}&plan=${amountValue}`,
      "",
      setPlansLoading,
      (res) => {
        setPlans(res.data.data || []);
        setPlansLoading(false);
      },
      (err) => {
        apiErrorToast(err);
        setPlansLoading(false);
      }
    );
  };

  // Filter operators based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOperators(operators);
    } else {
      const filtered = operators.filter((operator) =>
        operator.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOperators(filtered);
    }
  }, [searchTerm, operators]);

  // Fetch data on type change
  useEffect(() => {
    fetchMobileOperators();
  }, [type]);

  // Handle operator selection
  const handleOperatorClick = (operator) => {
    setSelectedOperator(operator);
    setPlans([]);
    reset({
      param1: "",
      param3: "",
    });
  };

  // Handle mobile number input to allow only numbers and limit to 10 digits
  const handleMobileNumberChange = (e, onChange) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(value);
  };

  // Handle amount input to prevent auto-fill and allow only valid numbers
  const handleAmountChange = (e, onChange) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onChange(value);
    }
  };

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setValue("param3", plan.plan);
    setPlansDrawerOpen(false);
  };

  // Handle form submission
  const onSubmit = (data) => {
    if (!mpin || mpin.length !== 6) {
      apiErrorToast("Please enter a valid 6-digit MPIN");
      return;
    }

    postJsonData(
      ApiEndPoint.PAY_RECHARGE,
      {
        operator: selectedOperator?.name,
        op_code: selectedOperator?.code,
        type: type,
        number: data.param1,
        amount: data.param3,
        mpin: mpin,
        platform: "WEB",
      },
      setLoading,
      (res) => {
        okSuccessToast(res.data.message);
        refreshUser();
        reset();
        setMpin("");
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  return (
    <Box p={2}>
      <Loader loading={loading} />
      
      <Grid container spacing={3}>
        {/* Left Side: Operator Cards */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
            <Box p={3}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Select an Operator
              </Typography>
              
              {/* Search Bar */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search operators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  autoComplete: "off",
                }}
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ maxHeight: "600px", overflowY: "auto", pr: 1 }}>
                <Grid container spacing={2}>
                  {filteredOperators.length > 0 ? (
                    filteredOperators.map((operator) => (
                      <Grid item xs={12} sm={12} md={12} key={operator.id}>
                        <CommenCardBill
                          title={operator.name}
                          // img={operator.code}
                          onClick={() => handleOperatorClick(operator)}
                          selected={selectedOperator?.id === operator.id}
                          sx={{
                            cursor: "pointer",
                            transition: "all 0.3s",
                            "&:hover": {
                              transform: "scale(1.03)",
                              boxShadow: 3,
                            },
                            height: "100%",
                          }}
                        />
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography textAlign="center" color="text.secondary">
                        No operators found
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Side: Form Inputs */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
            <Box p={3}>
              {selectedOperator ? (
                <Box>
                  <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                    {selectedOperator.name} Recharge
                  </Typography>
                  
                  <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                      maxWidth: "500px",
                      margin: "0 auto",
                      p: 4,
                      borderRadius: 2,
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Grid container spacing={3}>
                      {/* Mobile Number Input */}
                      <Grid item xs={12}>
                        <Controller
                          name="param1"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label={selectedOperator.params.param1}
                              autoComplete="off"
                              variant="outlined"
                              size="medium"
                              InputLabelProps={{ shrink: !!field.value }}
                              error={!!errors.param1}
                              helperText={errors.param1?.message}
                              onChange={(e) => handleMobileNumberChange(e, field.onChange)}
                              value={field.value}
                              inputProps={{
                                maxLength: 10,
                                inputMode: "numeric",
                                autoComplete: "off",
                              }}
                            />
                          )}
                        />
                      </Grid>

                      {/* Amount Input with View Plans button */}
                      <Grid item xs={12}>
                        <Controller
                          name="param3"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              autoComplete="off"
                              label={selectedOperator.params.param3}
                              variant="outlined"
                              size="medium"
                              InputLabelProps={{ shrink: !!field.value }}
                              error={!!errors.param3}
                              helperText={errors.param3?.message}
                              onChange={(e) => handleAmountChange(e, field.onChange)}
                              value={field.value}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Button
                                      variant="text"
                                      onClick={fetchPlans}
                                      disabled={!amountValue}
                                      sx={{ minWidth: '120px' }}
                                    >
                                      View Plans
                                    </Button>
                                  </InputAdornment>
                                ),
                              }}
                              inputProps={{
                                step: "0.01",
                                min: "0",
                                autoComplete: "off",
                              }}
                            />
                          )}
                        />
                      </Grid>
                      
                      {/* MPIN Input */}
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          Enter your MPIN to confirm the transaction
                        </Typography>
                        <PinInput size={6} setMpin={setMpin} value={mpin} />
                      </Grid>
                    </Grid>

                    {/* Submit Button */}
                    <Box mt={4} display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="large"
                        fullWidth
                        sx={{ py: 1.5 }}
                        disabled={!mpin || mpin.length !== 6}
                      >
                        Proceed to Recharge
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    textAlign: "center",
                    p: 3,
                  }}
                >
                  <Typography variant="h6" color="text.secondary" mb={2}>
                    Select an operator from the left panel
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Choose your mobile operator to proceed with the recharge
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Plans Drawer */}
<Drawer
  anchor="right"
  open={plansDrawerOpen}
  onClose={() => setPlansDrawerOpen(false)}
  PaperProps={{
    sx: {
      width: '100%',
      maxWidth: 600,
      mx: 'auto',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      p: 0,
      boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.1)',
      background: 'linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%)',
    }
  }}
>
  <Box sx={{ p: 3 }}>
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 3,
      background: '#0038A8',
      color: 'white',
      p: 2,
      mx: -3,
      mt: -3,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      boxShadow: '0 2px 8px rgba(0,56,168,0.2)'
    }}>
      <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
        Available Plans for ₹{amountValue}
      </Typography>
      <IconButton 
        onClick={() => setPlansDrawerOpen(false)} 
        sx={{ color: 'white' }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
    
    {plansLoading ? (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress sx={{ color: '#FF6319' }} />
      </Box>
    ) : plans.length > 0 ? (
      <List sx={{ py: 0 }}>
        {plans.map((plan, index) => (
          <React.Fragment key={plan.id}>
            <ListItem 
              button 
              onClick={() => handlePlanSelect(plan)}
              sx={{
                py: 2.5,
                px: 3,
                mb: 1,
                backgroundColor: 'white',
                borderRadius: 2,
                borderLeft: '4px solid #0038A8',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 12px rgba(0,56,168,0.15)',
                  borderLeft: '4px solid #FF6319'
                }
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight="bold" sx={{ color: '#0038A8', fontSize: '1.1rem' }}>
                  ₹{plan.plan} - {plan.validity} days
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                  {plan.description}
                </Typography>
                {plan.bonus && (
                  <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#FF631910',
                    color: '#FF6319',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    mt: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {/* <LocalOfferIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> */}
                    {plan.bonus}
                  </Box>
                )}
              </Box>
              <ChevronRightIcon sx={{ color: '#0038A8' }} />
            </ListItem>
            {index < plans.length - 1 && <Divider sx={{ my: 1, opacity: 0.5 }} />}
          </React.Fragment>
        ))}
      </List>
    ) : (
      <Box sx={{ 
        py: 4, 
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: 2,
        p: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        {/* <InboxIcon sx={{ fontSize: 48, color: '#0038A8', opacity: 0.5, mb: 1 }} /> */}
        <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
          No plans available for this amount
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            mt: 1,
            backgroundColor: '#FF6319',
            '&:hover': {
              backgroundColor: '#E55415'
            }
          }}
          onClick={() => setPlansDrawerOpen(false)}
        >
          Close
        </Button>
      </Box>
    )}
  </Box>
</Drawer>
    </Box>
  );
};

export default MobileRecharge;
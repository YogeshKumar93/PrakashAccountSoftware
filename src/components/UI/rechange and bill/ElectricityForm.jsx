import React, { useContext, useEffect, useState, useMemo, useCallback, memo } from "react";
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
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AuthContext from "../../../contexts/AuthContext";
import ApiEndpoints from "../../../api/ApiEndpoints";
import CommenCardBill from "../../common/CommenCardBill";
import Loader from "../../common/Loader";
import { apiCall } from "../../../api/apiClient";

// Memoized operator card component to prevent unnecessary re-renders
const OperatorCard = memo(({ operator, selected, onClick }) => (
  <Grid item xs={12} sm={6} md={4} key={operator.id}>
    <CommenCardBill
      title={operator.name}
      onClick={() => onClick(operator)}
      selected={selected}
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
));

// Validation schema - moved outside component to prevent recreation on every render
const createSchema = (hasParam2) => {
  return yup.object().shape({
    param1: yup
      .string()
      .required("Consumer number is required")
      .matches(/^[a-zA-Z0-9]+$/, "Invalid consumer number format"),
    param2: hasParam2 ? yup.string().required("This field is required") : yup.string(),
    amount: yup
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
};

const ElectricityForm = ({ type = "ELECTRICITY" }) => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mpin, setMpin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const authCtx = useContext(AuthContext);
  const { refreshUser } = authCtx;

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Memoized filtered operators based on search term
  const filteredOperators = useMemo(() => {
    if (!searchTerm.trim()) return operators;
    
    return operators.filter((operator) =>
      operator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, operators]);

  // Memoized validation schema based on selected operator
  const schema = useMemo(() => 
    createSchema(selectedOperator?.params?.param2), 
    [selectedOperator]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      param1: "",
      param2: "",
      amount: "",
    },
  });

  // Fetch Operators from API - memoized with useCallback
  const fetchOperators = useCallback(async (operatorType) => {
    setLoading(true);
    try {
      const response = await apiCall(
        "GET", 
        `${ApiEndpoints.GET_OPERATOR}?sub_type=${operatorType || type}`
      );
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      const operatorsData = response.response.data || [];
      
      const formattedOperators = operatorsData.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        img: item.img || "/default-operator.png",
        params: {
          param1: item.param1 || "Consumer Number",
          param2: item.param2 || "",
        },
      }));

      setOperators(formattedOperators);
      
      // Reset selected operator when operators change
      setSelectedOperator(null);
      reset({
        param1: "",
        param2: "",
        amount: "",
      });
    } catch (err) {
      setError(err.message || "Failed to fetch operators");
    } finally {
      setLoading(false);
    }
  }, [type, reset]);

  // Fetch operators when component mounts or type changes
  useEffect(() => {
    fetchOperators(type);
  }, [type, fetchOperators]);

  const handleOperatorClick = useCallback((operator) => {
    setSelectedOperator(operator);
    reset({
      param1: "",
      param2: "",
      amount: "",
    });
  }, [reset]);

  // Handle amount input to prevent auto-fill and allow only valid numbers
  const handleAmountChange = useCallback((e, onChange) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onChange(value);
    }
  }, []);

  // Handle form submission - memoized with useCallback
  const onSubmit = useCallback(async (data) => {
    if (!mpin || mpin.length !== 6) {
      setError("Please enter a valid 6-digit MPIN");
      return;
    }

    if (!selectedOperator) {
      setError("Please select an operator");
      return;
    }

    setLoading(true);
    try {
      const response = await apiCall("POST", ApiEndpoints.BBPS_PAY_BILL, {
        operator: selectedOperator.name,
        op_code: selectedOperator.code,
        type: type.toUpperCase(),
        number: data.param1,
        param1: data.param2 || "",
        amount: data.amount,
        platform: "WEB",
        mpin: mpin,
      });
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      reset();
      setMpin("");
      setSuccess("Payment successful!");
      refreshUser();
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }, [mpin, selectedOperator, refreshUser, reset, type]);

  // No providers message component
  const NoProvidersMessage = useMemo(() => (
    <Grid item xs={12}>
      <Typography textAlign="center" color="text.secondary">
        No providers found
      </Typography>
    </Grid>
  ), []);

  // Select provider prompt component
  const SelectProviderPrompt = useMemo(() => (
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
        Select a provider from the left panel
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Choose your service provider to proceed with the payment
      </Typography>
    </Box>
  ), []);

  return (
    <Box p={2}>
      <Loader loading={loading} />
      
      {/* Error and Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Left Side: Operator Cards */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
            <Box p={3}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Select Provider
              </Typography>
              
              {/* Search Bar */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search providers..."
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
                <Grid  spacing={2}>
                  {filteredOperators.length > 0 ? (
                    filteredOperators.map((operator) => (
                      <OperatorCard
                        key={operator.id}
                        operator={operator}
                        selected={selectedOperator?.id === operator.id}
                        onClick={handleOperatorClick}
                      />
                    ))
                  ) : (
                    NoProvidersMessage
                  )}
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Side: Form Inputs */}
        <Grid item xs={12} md={8} sx={{  maxWidth: "500px",}}>
          <Paper elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
            <Box p={3}>
              {selectedOperator ? (
                <Box>
                  <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                    {selectedOperator.name} Payment
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
                      {/* Consumer Number Input */}
                      <Grid item xs={12}>
                        <Controller
                          name="param1"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label={selectedOperator.params.param1}
                              variant="outlined"
                              size="medium"
                              InputLabelProps={{ shrink: !!field.value }}
                              error={!!errors.param1}
                              helperText={errors.param1?.message}
                              inputProps={{
                                autoComplete: "off",
                              }}
                            />
                          )}
                        />
                      </Grid>

                      {/* Additional Parameter Input - only shown if operator has param2 */}
                      {selectedOperator.params.param2 && (
                        <Grid item xs={12}>
                          <Controller
                            name="param2"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label={selectedOperator.params.param2}
                                variant="outlined"
                                size="medium"
                                InputLabelProps={{ shrink: !!field.value }}
                                error={!!errors.param2}
                                helperText={errors.param2?.message}
                                inputProps={{
                                  autoComplete: "off",
                                }}
                              />
                            )}
                          />
                        </Grid>
                      )}

                      {/* Amount Input */}
                      <Grid item xs={12}>
                        <Controller
                          name="amount"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Amount"
                              variant="outlined"
                              size="medium"
                              InputLabelProps={{ shrink: !!field.value }}
                              error={!!errors.amount}
                              helperText={errors.amount?.message}
                              onChange={(e) => handleAmountChange(e, field.onChange)}
                              value={field.value}
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
                          Enter your MPIN to confirm the payment
                        </Typography>
                        <TextField
                          fullWidth
                          type="password"
                          label="MPIN"
                          variant="outlined"
                          value={mpin}
                          onChange={(e) => setMpin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          inputProps={{
                            maxLength: 6,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          error={mpin.length > 0 && mpin.length !== 6}
                          helperText={mpin.length > 0 && mpin.length !== 6 ? "MPIN must be 6 digits" : ""}
                        />
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
                        disabled={!mpin || mpin.length !== 6 || loading}
                      >
                        {loading ? "Processing..." : `Pay ${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Bill`}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ) : (
                SelectProviderPrompt
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(ElectricityForm);
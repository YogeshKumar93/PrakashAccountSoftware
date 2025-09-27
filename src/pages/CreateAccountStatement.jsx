import React, { useEffect, useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";

const CreateAccountStatement = ({
  handleClose,
  onFetchRef,
  accountId,
  balance,
}) => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ account_id: accountId });
  const [disabledFields, setDisabledFields] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Fetch unclaimed entries
  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.GET_UNCLAIMED_ENTERIES
    );
    if (response) {
      setTransactions(response.data || []);
    } else {
      showToast(error?.message || "Failed to fetch transactions", "error");
    }
    setLoadingTransactions(false);
  };

  useEffect(() => {
    if (accountId) {
      setFormData({ account_id: accountId, balance: balance || 0 });
    }
    fetchTransactions();
  }, [accountId, balance]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "select_transaction") {
      // Check if static options
      if (value === "credit_option" || value === "value_option") {
        setFormData({
          account_id: accountId,
          select_transaction: value,
          bank_id: value, // send "credit" or "value"
          _bank_name_display: value === "credit_option" ? "Credit" : "Value",
          credit: 0,
          debit: 0,
          balance: balance || 0,
          remarks: "",
          particulars: "",
          id: value,
        });
        setDisabledFields([]);
        return;
      }

      // Normal transaction
      const selected = transactions.find((t) => String(t.id) === String(value));
      if (!selected) return;

      setFormData({
        account_id: accountId,
        select_transaction: `${selected.created_at} / ${
          selected.particulars
        } / ${
          parseFloat(selected.credit) > 0 ? selected.credit : selected.debit
        }`,
        bank_id: selected?.bank_id,
        _bank_name_display: selected?.bank_name || "",
        credit: selected?.credit,
        debit: selected?.debit,
        balance:
          parseFloat(balance || 0) +
          (parseFloat(selected.credit) > 0
            ? parseFloat(selected.credit)
            : -parseFloat(selected.debit)),
        remarks: selected?.remark || "",
        particulars: selected?.particulars || "",
        id: selected?.id,
      });

      setDisabledFields([
        "bank_id",
        "credit",
        "debit",
        "remarks",
        "particulars",
      ]);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.CREATE_ACCOUNT_STATEMENT,
      formData
    );

    if (response) {
      showToast(
        response?.message || "Account Statement Created successfully",
        "success"
      );
      setFormData({ account_id: accountId, balance: balance || 0 });
      setDisabledFields([]);
      fetchTransactions();
      onFetchRef();
      handleClose();
    } else {
      showToast(
        error?.message || "Failed to create Account Statement",
        "error"
      );
    }
    setSubmitting(false);
  };

  return (
    <Box
      sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "nowrap" }}
    >
      <Grid container spacing={1}>
        {/* Transaction Dropdown */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            label="Select Transaction"
            name="select_transaction"
            value={formData.id || ""}
            onChange={handleChange}
            sx={{ width: 250 }}
            size="small"
            disabled={loadingTransactions}
          >
            {[
              { id: "credit_option", bank_name: "Credit" },
              { id: "value_option", bank_name: "Value" },
              ...transactions,
            ].map((opt) => (
              <MenuItem key={opt.id} value={opt.id}>
                {opt.id === "credit_option" || opt.id === "value_option"
                  ? opt.bank_name
                  : `${opt.created_at} / ${opt.particulars} / ${
                      parseFloat(opt.credit) > 0 ? opt.credit : opt.debit
                    }`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Bank Name */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Bank"
            name="bank_id"
            value={formData._bank_name_display || ""}
            onChange={handleChange}
            sx={{ width: 250 }}
            size="small"
            disabled={disabledFields.includes("bank_id")}
          />
        </Grid>

        {/* Credit */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Credit"
            name="credit"
            type="number"
            value={formData.credit || 0}
            onChange={handleChange}
            sx={{ width: 250 }}
            size="small"
            disabled={disabledFields.includes("credit")}
          />
        </Grid>

        {/* Debit */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Debit"
            name="debit"
            type="number"
            value={formData.debit || 0}
            onChange={handleChange}
            sx={{ width: 250 }}
            size="small"
            disabled={disabledFields.includes("debit")}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={submitting}
        sx={{ mt: 1 }}
      >
        {submitting ? "Submitting..." : "Add"}
      </Button>
    </Box>
  );
};

export default CreateAccountStatement;

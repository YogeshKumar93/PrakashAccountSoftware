import React, { useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";

const DownloadExcel = ({ open, handleClose, onFetchRef, bankId, balance }) => {
  const { showToast } = useToast();

  useEffect(() => {
    if (open) {
      generateAndDownloadExcel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const generateAndDownloadExcel = async () => {
    try {
      // ✅ Optionally fetch schema to know field names (not required but can confirm structure)
      const { response: schemaResponse } = await apiCall(
        "POST",
        ApiEndpoints.GET_BANK_STATEMENT_SCHEMA
      );

      // ✅ Build dummy data (with real field names if schema available)
      const fields =
        schemaResponse?.data?.fields?.map((f) => f.name) || [
        //   "bank_id",
        //   "balance",
          "date",
          "credit",
          "debit",
          "mop",
          "handle_by",
          "particulars",
        ];

      const dummyData = [
        {
        //   bank_id: bankId || "123",
        //   balance: balance || 10000,
          date: new Date().toISOString().split("T")[0],
          credit: 205000,
          debit: 0,
          mop: "OFFLINE",
          handle_by: "RAUSHAN",
          particulars: "P2PAE",
        },
        {
        //   bank_id: bankId || "123",
        //   balance: (balance || 10000) + 5000 - 2000,
          date: new Date().toISOString().split("T")[0],
          credit:0,
          debit: 901000,
          mop: "SHANKY",
          handle_by: "NATKHAT",
          particulars: "TRANSUP",
        },
      ];

      // ✅ Convert to Excel
      const worksheet = XLSX.utils.json_to_sheet(dummyData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "BankStatement");

      // ✅ Write to file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `BankStatement_Sample_${bankId || "Data"}.xlsx`);
      showToast("Sample Excel downloaded successfully!", "success");

      // ✅ Close modal + trigger refresh
      handleClose?.();
      onFetchRef?.();
    } catch (err) {
      console.error("Excel download error:", err);
      showToast("Failed to download Excel file", "error");
    }
  };

  return null; // no UI or modal
};

export default DownloadExcel;

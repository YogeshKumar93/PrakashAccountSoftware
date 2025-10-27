// hooks/useExcelExport.js
import { useCallback } from "react";
import { apiCall } from "../api/apiClient";
import { json2Excel } from "../utils/exportToExcel";
import { apiErrorToast } from "../utils/ToastUtil";

export const useExcelExport = () => {
  const handleExportExcel = useCallback(
    async (endpoint, appliedFilters = {}, exportFileName = "Data") => {
      try {
        console.log(
          "🔍 [Excel Export] Starting export with filters:",
          appliedFilters
        );

        // Filter out only the filters that have values (not empty, not "All")
        const activeFilters = {};

        Object.keys(appliedFilters).forEach((key) => {
          const value = appliedFilters[key];

          // Skip empty values, "All", and empty objects
          if (value === "All" || value === "" || value == null) {
            return;
          }

          // Handle daterange objects
          if (typeof value === "object" && value !== null) {
            // For daterange, check if either start or end has value
            if (
              (value.start && value.start !== "") ||
              (value.end && value.end !== "")
            ) {
              activeFilters[key] = value;
            }
            return;
          }

          // For other types, only include if not empty
          if (value !== "") {
            activeFilters[key] = value;
          }
        });

        // Handle date_range specifically if it exists in active filters
        if (
          activeFilters.date_range &&
          typeof activeFilters.date_range === "object"
        ) {
          const { start, end } = activeFilters.date_range;
          if (start) activeFilters.from_date = start;
          if (end) activeFilters.to_date = end;
          delete activeFilters.date_range;
        }

        console.log(
          "🔍 [Excel Export] Active filters after processing:",
          activeFilters
        );

        // Send only active filters + export flag to API
        const payload = { ...activeFilters, export: 1 };
        console.log("🔍 [Excel Export] Final API payload:", payload);

        const { error, response } = await apiCall("post", endpoint, payload);

        const exportData = response?.data || [];
        console.log(
          "🔍 [Excel Export] Response data count:",
          exportData.length
        );

        if (exportData.length > 0) {
          json2Excel(exportFileName, exportData);
          return {
            success: true,
            message: `${exportFileName} exported successfully`,
          };
        } else {
          apiErrorToast("No data found for export");
          return { success: false, message: "No data found" };
        }
      } catch (error) {
        console.error("❌ [Excel Export] Failed:", error);
        apiErrorToast("Failed to export Excel");
        return { success: false, message: "Export failed" };
      }
    },
    []
  );

  return { handleExportExcel };
};

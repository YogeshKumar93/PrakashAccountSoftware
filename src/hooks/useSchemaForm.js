// useSchemaForm.js
import { useState, useEffect } from "react";
import { apiCall } from "../api/apiClient";

export const useSchemaForm = (endpoint, open) => {
  const [schema, setSchema] = useState([]);
  const [formName, setFormName] = useState("");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      (async () => {
        try {
          setLoading(true);
          const res = await apiCall("post", endpoint);

          const payload =
            res?.data?.data || res?.data || res?.response?.data || res;

          console.log("📥 Schema structure:", payload);

          if (payload?.fields) {
            const normalizedFields = payload.fields.map((f) => {
              if (f.name === "service_name" && Array.isArray(f.options)) {
                return {
                  ...f,
                  options: f.options.map((opt) => ({
                    value: opt.name,
                    label: opt.name,
                    ...opt,
                  })),
                };
              }

              if (f.name === "bank_name" && Array.isArray(f.options)) {
                return {
                  ...f,
                  options: f.options.map((opt) => ({
                    value: opt.bank_name,
                    label: opt.bank_name,
                    ...opt,
                  })),
                };
              }

              return f;
            });

            setFormName(payload.formName || "Form");
            setSchema(normalizedFields);

            // ✅ Initialize with empty form data only
     // inside useSchemaForm
const initData = {};
normalizedFields.forEach((f) => {
  initData[f.name] = formData[f.name] ?? "";  // keep existing value if present
});
setFormData((prev) => ({ ...initData, ...prev }));

            setErrors({});
          } else {
            console.warn("⚠️ No fields found in payload:", payload);
          }
        } catch (err) {
          console.error("❌ Schema fetch failed:", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [open, endpoint]);

 const handleChange = (e) => {
  const { name, value } = e.target;
  const field = schema.find((f) => f.name === name);

  let errorMsg = "";

  // ✅ Apply regex validation if present
  if (field?.validation?.regex) {
    try {
      // safely convert string regex like "/^[0-9]{6,18}$/"
      const regexString = field.validation.regex;
      const pattern = new RegExp(
        regexString.replace(/^\/|\/$/g, "") // remove slashes
      );
      if (!pattern.test(value)) {
        errorMsg =
          field.validation.message ||
          `${field.label || name} is invalid`;
      }
    } catch (err) {
      console.error("Invalid regex from schema:", field.validation.regex, err);
    }
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: errorMsg,
  }));
};


  return {
    schema,
    formName,
    formData,
    setFormData,
    handleChange,
    errors,
    setErrors,
    loading,
  };
};
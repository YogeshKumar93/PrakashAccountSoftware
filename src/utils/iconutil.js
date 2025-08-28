export const getModesIcon = (mode = "web") => {
  const md = mode?.toLowerCase().replace(" ", "_");
  const modeMap = {
    cash_payment: "vaadin:cash",
    account_deposit: "ic:round-account-balance",
  };
  return modeMap[md] || "vaadin:cash";
};

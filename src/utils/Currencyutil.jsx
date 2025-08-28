export const currencySetter = (number) => {
  let theNewCurrency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
  let currencySymbol = theNewCurrency.substring(0, 1);

  let theAmount = theNewCurrency.substring(1);
  if (theAmount.endsWith(".00")) {
    theAmount = theAmount.slice(0, -3);
  }

  return `${currencySymbol} ${theAmount}`;
};

export const numberSetter = (number) => {
  let theNewCurrency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
  // let currencySymbol = theNewCurrency.substring(0, 1);
  //   let theAmount = theNewCurrency.substring(1, theNewCurrency.length);
  let theAmount = theNewCurrency.substring(1);
  return `${theAmount}`;
};

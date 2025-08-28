export const maskFunction = (bankAcct) => {
  if (bankAcct) {
    let lastFour = bankAcct.slice(-4);

    //
    let restOfStars = "*";
    let restOfFour = bankAcct.substring(0, bankAcct.length - 1);
    for (let i = 0; i < restOfFour.length - 1; i++) {
      restOfStars += "*";
    }
    return `${restOfStars}${lastFour}`;
  }
};

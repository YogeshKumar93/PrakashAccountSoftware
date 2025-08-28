export const cardNumberFormat = (cardNumber) => {
  let num = cardNumber.replace(/-/g, "");
  let len = num.length;
  if (len !== 0 && len !== 16 && len % 4 === 0) {
    if (cardNumber.charAt(cardNumber.length - 1) === "-") {
      let card = cardNumber.slice(0, cardNumber.length - 1);
      return card;
    }
    return cardNumber + "-";
  }
};
export const adhaarNumberFormat = (cardNumber) => {
  let num = cardNumber.replace(/-/g, "");
  let len = num.length;
  console.log("length ", len);
  if (len !== 0 && len !== 12 && len % 4 === 0) {
    if (cardNumber.charAt(cardNumber.length - 1) === "-") {
      let card = cardNumber.slice(0, cardNumber.length - 1);
      console.log("cardnumber", card);
      return card;
    }
    return cardNumber + "-";
  }
};

export const capitalize = (word) => {
  const lower = word.toLowerCase();
  return word.charAt(0).toUpperCase() + lower.slice(1);
};
// another capitlize is in text util

var a = [
  "",
  "one ",
  "two ",
  "three ",
  "four ",
  "five ",
  "six ",
  "seven ",
  "eight ",
  "nine ",
  "ten ",
  "eleven ",
  "twelve ",
  "thirteen ",
  "fourteen ",
  "fifteen ",
  "sixteen ",
  "seventeen ",
  "eighteen ",
  "nineteen ",
];
var b = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
let num;
export const numberToWord = (number) => {
  num = parseInt(number);
  if ((num = num.toString()).length > 9) {
    return "overflow";
  } else if (num == 0) {
    return "Zero";
  }
  let n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
      : "";
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
        "only "
      : "";
  return str;
};

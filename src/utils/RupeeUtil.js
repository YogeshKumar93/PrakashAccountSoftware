export const rupeeIn2Dec = (data) => {
  return data ? "\u20b9 " + parseFloat(data).toFixed(2) : "\u20b9 0";
};
export const num2rupee = (data) => {
  return data ? "\u20b9 " + parseFloat(data).toFixed(0) : "\u20b9 0";
};

export const numIn2Dec = (data) => {
  return data ? parseFloat(data).toFixed(2) : "0";
};
export const numIn42Dec = (data) => {
  return data ? parseFloat(data).toFixed(4) : "0";
};

export const value1Dec = (data) => {
  return data ? parseFloat(data).toFixed(2) : "0";
};

export const p2r = (data) => {
  return data ? "\u20b9 " + parseInt(data) / 100 : "\u20b9 ";
};

export const rupee5000Multiple = (data) => {
  let array = [];
  let data1 = data;
  let q;
  let rem = data1 % 5000;
  data = data1 - rem;
  q = data / 5000;
  if (rem) array.push(rem);
  for (let i = 0; i < q; i++) {
    array.push(5000);
  }
  return array;
};

// number to words logic . . . . . . .
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
export const num2Words = (number) => {
  num = parseInt(number);
  if ((num = num.toString()).length > 9) {
    return "overflow";
  } else if (num === 0) {
    return "Zero";
  }
  let n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = "";
  str +=
    n[1] !== 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
      : "";
  str +=
    n[2] !== 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
      : "";
  str +=
    n[3] !== 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
      : "";
  str +=
    n[4] !== 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
      : "";
  str +=
    n[5] !== 0
      ? (str !== "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
        "only "
      : "";
  return str;
};

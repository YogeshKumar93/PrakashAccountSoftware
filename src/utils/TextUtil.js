export function capitalize1(str) {
  if (!str || str === "") {
    return "";
  }
  const arr = str.split(" ");
  let res = "";
  arr.forEach((element) => {
    res +=
      element.charAt(0).toUpperCase() +
      element.substr(1, element.length).toLowerCase() +
      " ";
  });
  return res;
}

// another capitlize is in formattig util util

export const concatString = (text1, text2) => {
  return text1.concat(" ", text2);
};
export const stringUpper = (text) => {
  if (text) return text.toUpperCase();
  else return null;
};

export const toInt = (text) => {
  return parseInt(text);
};

export const repSpace = (text) => {
  if (!text || text === "") {
    return "";
  }
  let new_text = text.replace(" ", "_");
  return new_text;
};

export const genrandstr = (length = 30) => {
  const characters = "0123456789";
  // "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    randomString += characters[Math.floor(Math.random() * charactersLength)];
  }

  return randomString;
};

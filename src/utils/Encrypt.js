import CryptoJS from "crypto-js";
const REACT_APP_SECRET_KEY = "Xn2r5u8x/A?D(G+KbPeShVmYp3s6v9y$";
export const encryptData = (param) => {
  if (param) {
    const data = CryptoJS.AES.encrypt(
      JSON.stringify(param),
      REACT_APP_SECRET_KEY
    ).toString();
    return data ? data : false;
  } else {
    return false;
  }
};

export const decryptData = (param) => {
  // const encrypted = localStorage.getItem(param);
  if (param) {
    const decrypted = CryptoJS.AES.decrypt(
      param,
      REACT_APP_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted ? decrypted : false);
  } else {
    return false;
  }
};

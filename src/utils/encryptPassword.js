import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Hex.parse(process.env.REACT_APP_PASSWORD_ENCRYPTION_KEY);
const iv = CryptoJS.enc.Hex.parse(process.env.REACT_APP_PASSWORD_ENCRYPTION_IV);

const encryptPassword = (data) => {
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv }).toString();
  return encrypted;
}

export default encryptPassword;

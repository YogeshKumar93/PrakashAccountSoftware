import CryptoJS from 'crypto-js';

const HashPayload = (payload) => {
  console.log("Entered HashPayload")
  if(payload === ''){
    return payload
  }else{
    
  // Preparing string
  const sorted_object = sortObjectKeysAlphabetically(payload)
  const processed_keys = Object.values(sorted_object).join("")
  const raw_data = processed_keys + process.env.REACT_APP_HASH_KEY;
  
  // Generating Hash
  const hashPwd = CryptoJS.SHA256(raw_data).toString(CryptoJS.enc.Hex);

  payload.hash = hashPwd;
  return payload;
  }
}

const sortObjectKeysAlphabetically = (obj) => {
    return Object.keys(obj)
      .sort()
      .reduce((sortedObj, key) => {
        sortedObj[key] = obj[key]; 
        return sortedObj;
      }, {});
  }

export default HashPayload;

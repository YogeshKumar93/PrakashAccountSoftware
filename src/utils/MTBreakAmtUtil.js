import { postJsonData } from "../network/ApiController";

export const performMt = (
  index,
  n,
  arrAmtRes,
  postData,
  onPartSuccess,
  onSuccess,
  onComplete,
  onFailed,
  setRequest,
  apiEnd,
  setOpenConfirm
) => {
  setOpenConfirm(false);
  if (index > n - 1) {
    setRequest(true);
    onComplete();
    onSuccess(arrAmtRes);
    setRequest(false);
    return;
  }
  const obj = arrAmtRes[index];
  const meta = obj.meta;
  postData.amount = obj.amount;
  postJsonData(
    // ApiEndpoints.DMR_MONEY_TRANSFER,
    apiEnd,
    postData,
    (flag) => {
      meta.processing = flag;
      setRequest(flag);
    },
    (data) => {
      meta.res = data.data;
      onPartSuccess(index, obj);
      // console.log(`sucess ${JSON.stringify(index)} --- ${JSON.stringify(obj)}`);
      performMt(
        index + 1,
        n,
        arrAmtRes,
        postData,
        onPartSuccess,
        onSuccess,
        onComplete,
        onFailed,
        setRequest,
        apiEnd,
        setOpenConfirm
      );
    },
    (error) => {
      onFailed(index, error);
    }
  );
};

export const breakAmt = (amt, limit_per_txn) => {
  let limit = parseInt(limit_per_txn);
  let amt_arr = [];
  if (amt < limit) {
    amt_arr.push(amt);
    return amt_arr;
  }
  while (amt > limit) {
    // let r = amt / Math.floor(limit);
    amt_arr.push(limit);
    amt = amt - limit;
  }
  amt_arr.push(amt);
  // console.log("amount ", amt_arr);
  return amt_arr.reverse();
};

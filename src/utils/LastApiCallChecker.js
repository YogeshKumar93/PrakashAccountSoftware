const MIN_DURATION = 10000;
let lastApiCallTime;

export const validateApiCall = () => {
  let flag = true;
  const timeNow = Date.now();
  let diff;
  if (lastApiCallTime) {
    diff = timeNow - lastApiCallTime;
    if (diff > MIN_DURATION) {
      lastApiCallTime = timeNow;
      flag = true;
    } else {
      flag = false;
    }
  } else {
    lastApiCallTime = Date.now();
  }
  // console.log(
  //   "validateApiCall invoked : timeNow = " +
  //     timeNow +
  //     ", lastApiCallTime = " +
  //     lastApiCallTime +
  //     ", flag = " +
  //     flag +
  //     ", diff : " +
  //     diff +
  //     " milliseconds"
  // );
  return flag;
};

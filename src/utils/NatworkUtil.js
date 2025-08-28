export const checkNetwork = () => {
  let networkStatus = window.navigator.onLine;
  window.addEventListener("online", (on) => {
    if (on && on.type === "online") {
      networkStatus = true;
      console.log("networkStatus=>", networkStatus);
      return true;
    }
  });
  window.addEventListener("offline", (off) => {
    if (off && off.type === "offline") {
      networkStatus = false;
      console.log("networkStatus=>", networkStatus);
      return false;
    }
  });
  return networkStatus;
};

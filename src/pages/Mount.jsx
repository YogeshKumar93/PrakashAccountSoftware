import React from "react";

const Mount = ({ visible, children }) => {
  if (!visible) return <></>;
  return <>{children}</>;
};

export default Mount;

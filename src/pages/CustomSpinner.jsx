import React from "react";
import { useEffect } from "react";

const CustomSpinner = ({
  height = "10px",
  width = "10px",
  marginLeft = "10px",
  n = 4,
}) => {
  const style = {
    height: height,
    width: width,
    marginLeft: marginLeft,
  };
  const [ball, setBall] = React.useState([]);
  useEffect(() => {
    const balls = [];
    for (let i = 0; i < n; i++) {
      balls[i] = <div className="ball" style={style} key={i}></div>;
    }
    setBall(balls);
    return () => {};
  }, [n]);

  return <div className="ball-container">{ball}</div>;
};

export default CustomSpinner;

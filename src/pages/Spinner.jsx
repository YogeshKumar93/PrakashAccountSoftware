import React from "react";
import { CircularProgress } from "@mui/material";
import CustomSpinner from "./CustomSpinner";
// import { white } from '@mui/material/colors';

const Spinner = ({
  loading,
  dots = false,
  circle = false,
  dotCircle = false,
  dotCircleWhite = false,
  dotBnW = false,
  circleBlue = true,
  size = "Big",
}) => {
  const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "99%",
    height: "100%",
    zIndex: 1000,
    top: 0,
    left: "1px",
    position: "absolute",
    backgroundColor: "#ffffff10",
    borderRadius: "4px",
    backdropFilter: "blur(3px)",
    color: "#fff",
  };
  const circleStyle = {
    color: "#000",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-12px",
    marginLeft: "-12px",
    zIndex: "10",
  };
  return (
    <div
      hidden={!loading}
      className="position-absolute text-primary fw-bolder fs-4"
      style={divStyle}
    >
      {dots && <CustomSpinner />}
      {circle && <CircularProgress size={24} sx={circleStyle} />}
      {dotCircle && <div class="dot"></div>}
      {dotCircleWhite && <div class="dot-white"></div>}
      {dotBnW && <div class="dot-bnw"></div>}
      {circleBlue && (
        <div
          className={`${
            size === "Big" ? "circle-blue" : "circle-blue small-circle-blue"
          } `}
        ></div>
      )}
    </div>
  );
};

export default Spinner;

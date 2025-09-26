import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
const RetTxnCardComponent = ({ item, isTransaction }) => {
  const isTotal = item.name === "TOTAL";
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const handleNavigate = () => {
    const statusData = { status: item.name };
    if (user.role === "Ret" || user.role === "Dd") {
      navigate("/customer/transactions", { state: statusData });
    } else if (user.role === "Api") {
      navigate("/api-user/transactions", { state: statusData });
    }
  };

  const handleAsmNavigate = () => {
    const statusData = { status: item.name };
    navigate("/asm/transactions", { state: statusData });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: isTotal ? "#D48628" : "white",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        p: 1,
        position: "relative",
        height: { xs: "auto", sm: "150px" },
        width: { xs: "100%", md: "130px", sm: "160px", lg: "90%" },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          top: "10px",
          left: "10px",
          right: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: { xs: "12px", sm: "15px" },
              color: isTotal ? "#fff" : "",
            }}
          >
            {item.name}
          </Typography>
        </Box>
        {!isTransaction ? (
          <button
            to="/customer/transactions"
            onClick={handleNavigate}
            style={{
              backgroundColor: isTotal ? "#fff" : "#000",
              width: "32px",
              padding: "1px",
              borderRadius: "30px",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              zIndex: 1,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 16 16"
              className="svg"
            >
              <path
                fill={isTotal ? "#D48628" : "#fff"}
                fillRule="evenodd"
                d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
              />
            </svg>
          </button>
        ) : (
          <button
            to="/asm/transactions"
            onClick={handleAsmNavigate}
            style={{
              backgroundColor: isTotal ? "#fff" : "#000",
              width: "32px",
              padding: "1px",
              borderRadius: "30px",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              zIndex: 1,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 16 16"
              className="svg"
            >
              <path
                fill={isTotal ? "#D48628" : "#fff"}
                fillRule="evenodd"
                d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
              />
            </svg>
          </button>
        )}
      </Box>
      <Box
        sx={{
          backgroundColor: isTotal ? "#fff" : item.circleColor,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "30px",
          height: "30px",
          mt: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "16px", sm: "20px" }, // Responsive font size for mobile and desktop
            fontWeight: "bold",
            color: isTotal ? "#D48628" : item.color,
          }}
        >
          ₹
        </Typography>
      </Box>
      <Typography
        sx={{
          top: "50px",
          left: "10px",
          fontWeight: "bold",
          fontSize: { xs: "18px", sm: "22px" }, // Responsive font size
          color: isTotal ? "#fff" : item.color,
          mt: 1,
          ml: 1,
          zIndex: 1,
        }}
      >
        {item.balance}
      </Typography>

      <Typography
        sx={{
          top: "90px",
          left: "10px",
          fontSize: { xs: "12px", sm: "14px" }, // Responsive font size
          color: isTotal ? "#fff" : "#5E3401",
          fontWeight: "600",
          mt: 1,
          ml: 1,
          display: "flex",
          alignItems: "center",
          gap: "5px",
          zIndex: 1,
        }}
      >
        + {Number(item.percent).toFixed(2)}%
        <ArrowUpwardIcon
          sx={{
            color: isTotal ? "#fff" : "#000",
            fontSize: { xs: "11px", sm: "13px" },
          }}
        />
      </Typography>

      {!isTotal && (
        <img
          src={item.image}
          alt={`${item.name} Icon`}
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            top: "15%",
            // opacity: "20",
            // zIndex: "-1",
          }}
        />
      )}
    </Box>
  );
};

export default RetTxnCardComponent;

import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";

const NewsSection = () => {
  const [data, setData] = useState([]);
  const [isProgress, setIsProgress] = useState(false);

  console.log("the news data is", data);
  const colors = ["#000000"];

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
      sx={{
        textAlign: "center",
        display: "flex",
        borderRadius: "8px",
        // backgroundImage: gradientColor,
        color: "#004080",
        fontSize: "18px",
        alignItems: "center",
        justifyContent: "right",
        marginBottom: "0.6rem",
        padding: "8px 6px",
      }}
    >
      <marquee direction="left" style={{ width: "100%" }}>
        <span
          // key={index}
          style={{
            // color: colors[index % colors.length],
            color: "#000",
            margin: "0 8px",
          }}
        >
          hello welcome to my website
          {/* {item.news} */}
          {/* {index < data.length - 1 && " | "} */}
        </span>
      </marquee>
    </Grid>
  );
};

export default NewsSection;

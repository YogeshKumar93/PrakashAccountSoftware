import React from "react";
import { Line } from "react-chartjs-2";

const MonthlyDataChart = () => {
  const monthlyData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Sales",
        data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1100],
        fill: true,
        borderColor: "#4045A1",
        backgroundColor: "rgba(96, 89, 201, 0.3)",
        lineTension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        title: { display: true, text: "Amount in ₹" },
      },
      x: {
        title: { display: true, text: "Months" },
      },
    },
  };

  return <Line data={monthlyData} options={options} />;
};

export default MonthlyDataChart;

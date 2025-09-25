import React, { useEffect } from "react";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminBarChart = ({ graphData }) => {
  const [chartData, setChartData] = useState();
  const [chartDates, setChartDates] = useState();

  useEffect(() => {
    setChartData(graphData && graphData.map((item) => item.val));
    setChartDates(graphData && graphData.map((item) => item.service));
  }, [graphData]);

  const data1 = {
    labels: chartDates && chartDates,
    datasets: [
      {
        data: chartData && chartData,
        fill: true,
        backgroundColor: [
          "rgba(255, 99, 133, 0.385)",
          "rgba(255, 160, 64, 0.385)",
          "rgba(255, 204, 86, 0.385)",
          "rgba(75, 192, 192, 0.385)",
          "rgba(54, 162, 235, 0.385)",
          "rgba(153, 102, 255, 0.385)",
          "rgba(201, 203, 207, 0.385)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        title: { display: true, text: "Amount in ₹" },
      },
      x: {
        title: { display: true, text: "Services" },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  return <Bar data={data1 && data1} options={options} />;
};

export default AdminBarChart;

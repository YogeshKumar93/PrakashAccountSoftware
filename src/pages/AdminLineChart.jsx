import React, { useEffect } from "react";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminLineChart = ({ graphData, id = "" }) => {
  const [chartData, setChartData] = useState();
  const [chartDates, setChartDates] = useState();

  useEffect(() => {
    setChartData(graphData && graphData.map((item) => item.total));
    setChartDates(graphData && graphData.map((item) => item.dates));
  }, [graphData]);

  const data1 = {
    labels: chartDates && chartDates,
    datasets: [
      {
        data: chartData && chartData,
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

  return (
    <divs>
      <Line data={data1 && data1} options={options} />
    </divs>
  );
};

export default AdminLineChart;

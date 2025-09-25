import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Line } from "react-chartjs-2";

const returnObjOfChart = (item) => {
  return {
    label: item.label,
    fill: false,
    data: item.data,
    borderColor: item.color,
    lineTension: 0.4,
    hidden: item.hidden,
  };
};

const LineChartAllServices = ({ graphData }) => {
  const chartRef = useRef(null);

  const [chartDataSets, setChartDataSets] = useState([
    {
      label: "Payment",
      data: [0, 2, 7, 1, 5, 2, 0, 9, 4, 0],
      fill: true,
      borderColor: "#0077b6",
      backgroundColor: "#0077b619",
      lineTension: 0.4,
    },
  ]);

  const [chartDates, setChartDates] = useState();

  useEffect(() => {
    setChartDates(graphData ? graphData.days.map((item) => `${item}`) : []);

    const newChartData = [
      {
        label: "Money Transfer",
        data: graphData && graphData.money_transfer,
        color: "rgb(255, 99, 0.385)",
        hidden: true,
      },
      {
        label: "AEPS",
        data: graphData && graphData.aeps,
        color: "rgb(255, 159, 60.3854)",
        hidden: false,
      },
      {
        label: "Prepaid",
        data: graphData && graphData.prepaid,
        color: "rgb(255, 205, 0.385)",
        hidden: true,
      },
      {
        label: "Utility",
        data: graphData && graphData.utility,
        color: "rgb(75, 192, 0.385)",
        hidden: true,
      },
      {
        label: "Verification",
        data: graphData && graphData.verification,
        color: "rgb(54, 162, 0.385)",
        hidden: true,
      },
      {
        label: "UPI Collection",
        data: graphData && graphData.upi_collect,
        color: "rgb(153, 102, 0.385)",
        hidden: true,
      },
      {
        label: "Collections",
        data: graphData && graphData.collections,
        color: "rgb(201, 203, 0.385)",
        hidden: true,
      },
      {
        label: "PG Collect",
        data: graphData && graphData.pgCollect,
        color: "#ff69b4",
        hidden: true,
      },
      {
        label: "W2W",
        data: graphData && graphData.w2w,
        color: "#57aaee",
        hidden: true,
      },
      {
        label: "Payments",
        data: graphData && graphData.payments,
        color: "#1a598d",
        hidden: true,
      },
      {
        label: "Settlements",
        data: graphData && graphData.settlements,
        color: "#0077b6",
        hidden: true,
      },
    ];

    setChartDataSets(
      newChartData.map((item) => {
        return returnObjOfChart(item);
      })
    );
  }, [graphData]);

  const data1 = {
    labels: chartDates && chartDates,
    datasets: chartDataSets,
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        title: { display: true, text: "Amount in ₹" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          boxWidth: 20,
        },
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
      title: {
        display: true,
        // text: "All Services Data",
      },
      subtitle: {
        display: false,
        // text: "All Services Data",
      },
    },
    transitions: {
      hide: {
        animations: {
          x: {
            to: 0,
          },
          y: {
            to: 0,
          },
        },
      },
    },
    onClick: (e, items) => {
      if (items.length > 0) {
        const clickedDatasetIndex = items[0].datasetIndex;
        const updatedDataSets = chartDataSets.map((dataset, index) => ({
          ...dataset,
          hidden: index !== clickedDatasetIndex,
        }));
        setChartDataSets(updatedDataSets);
        chartRef.current.chartInstance.update(); // Update the chart
      }
    },
  };

  return (
    <div>
      <Line ref={chartRef} data={data1 && data1} options={options} />
    </div>
  );
};

export default LineChartAllServices;

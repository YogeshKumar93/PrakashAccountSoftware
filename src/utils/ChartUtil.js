export const totalChartData = (chartData) => {
  let moneyDatesSum = 0;
  let aepsDatesSum = 0;
  let prepaidDatesSum = 0;
  let utilitiesDatesSum = 0;
  let pgCollectSum = 0;
  let paymentsDatesSum = 0;
  let settlementsDatesSum = 0;
  let total = 0;
  let chartNewData = [];
  for (let i = 0; i < chartData.money_transfer.length; i++) {
    aepsDatesSum = chartData.aeps[i] * 1;
    pgCollectSum = chartData.pgCollect[i] * 1;
    moneyDatesSum = chartData.money_transfer[i] * 1;
    prepaidDatesSum = chartData.prepaid[i] * 1;
    utilitiesDatesSum = chartData.utility[i] * 1;
    settlementsDatesSum = chartData.settlements[i] * 1;
    paymentsDatesSum = chartData.payments[i] * 1;

    total =
      moneyDatesSum +
      aepsDatesSum +
      prepaidDatesSum +
      utilitiesDatesSum +
      pgCollectSum +
      paymentsDatesSum +
      settlementsDatesSum;
    chartNewData.push({ dates: `${chartData.days[i]}`, total });
  }

  return chartNewData;
};

export const barChartData = (chartData) => {
  let chartNewData = [];
  chartNewData.push({ service: "aeps", val: chartData.aeps[0] * 1 });
  // chartNewData.push({
  //   service: "collections",
  //   val: chartData.collections[0] * 1,
  // });
  chartNewData.push({ service: "PG Collect", val: chartData.pgCollect[0] * 1 });
  chartNewData.push({
    service: "money_transfer",
    val: chartData.money_transfer[0] * 1,
  });
  chartNewData.push({ service: "payments", val: chartData.payments[0] * 1 });
  chartNewData.push({
    service: "prepaid",
    val: chartData.prepaid[0] * 1,
  });
  chartNewData.push({
    service: "settlements",
    val: chartData.settlements[0] * 1,
  });
  // chartNewData.push({
  //   service: "upi_collect",
  //   val: chartData.upi_collect[0] * 1,
  // });
  chartNewData.push({ service: "utility", val: chartData.utility[0] * 1 });
  // chartNewData.push({
  //   service: "verification",
  //   val: chartData.verification[0] * 1,
  // });
  // chartNewData.push({
  //   service: "w2w",
  //   val: chartData.w2w[0] * 1,
  // });

  return chartNewData;
};

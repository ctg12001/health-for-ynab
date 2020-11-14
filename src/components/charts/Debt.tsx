import React from "react";
import { MonthMetrics } from "../../calculations/monthSummary";
import { getMonthsInRange, serializeDate } from "../../utils/date";
import Chart from "./Chart";

interface DebtProps {
  months: Map<string, MonthMetrics>;
  startDate: Date;
  endDate: Date;
}

interface DebtDataPoint {
  month: string;
  "Debt/Income": number;
}

const Debt = (props: DebtProps) => {
  const { months, startDate, endDate } = props;
  const data: DebtDataPoint[] = [];
  getMonthsInRange(startDate, endDate).forEach((date) => {
    const month = months.get(serializeDate(date));
    if (month) {
      data.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        "Debt/Income": month.debtPayments / month.income,
      });
    }
  });
  return (
    <Chart<DebtDataPoint>
      data={data}
      x="month"
      y="Debt/Income"
      tickFormatter={(value) => value * 100 + "%"}
      tooltipFormatter={(value) =>
        (parseFloat(value.toString()) * 100).toFixed(2) + "%"
      }
      referenceRanges={[
        {
          color: "green",
          y2: 0.25,
        },
        {
          color: "yellow",
          y1: 0.25,
          y2: 0.4,
        },
        {
          color: "red",
          y1: 0.4,
        },
      ]}
    />
  );
};

export default Debt;

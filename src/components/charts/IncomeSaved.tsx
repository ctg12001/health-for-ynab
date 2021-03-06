import React from "react";
import { MonthMetrics } from "../../calculations/monthSummary";
import { getMonthsInRange, serializeDate } from "../../utils/date";
import Chart from "./Chart";

interface IncomeSavedProps {
  months: Map<string, MonthMetrics>;
  startDate: Date;
  endDate: Date;
}

interface IncomeSavedDataPoint {
  month: string;
  "Income Saved": number;
}

const IncomeSaved = (props: IncomeSavedProps) => {
  const { months, startDate, endDate } = props;
  const data: IncomeSavedDataPoint[] = [];
  getMonthsInRange(startDate, endDate).forEach((date) => {
    const month = months.get(serializeDate(date));
    if (month) {
      data.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        "Income Saved": (month?.income - month?.expenses) / month?.income,
      });
    }
  });
  return (
    <Chart<IncomeSavedDataPoint>
      data={data}
      x="month"
      y="Income Saved"
      tickFormatter={(value) => value * 100 + "%"}
      tooltipFormatter={(value) =>
        (parseFloat(value.toString()) * 100).toFixed(2) + "%"
      }
      referenceRanges={[
        {
          color: "green",
          y1: 0.2,
        },
        {
          color: "yellow",
          y1: 0.05,
          y2: 0.2,
        },
        {
          color: "red",
          y2: 0.05,
        },
      ]}
    />
  );
};

export default IncomeSaved;

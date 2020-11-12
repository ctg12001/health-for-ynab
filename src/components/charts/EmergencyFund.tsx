import React from "react";
import { MonthMetrics } from "../../calculations/monthSummary";
import { getMonthsInRange, serializeDate } from "../../utils/date";
import Chart from "./Chart";

interface EmergencyFundProps {
  months: Map<string, MonthMetrics>;
  startDate: Date;
  endDate: Date;
}

interface EmergencyFundDataPoint {
  month: string;
  "Months of Savings": number;
}

const EmergencyFund = (props: EmergencyFundProps) => {
  const { months, startDate, endDate } = props;
  const data: EmergencyFundDataPoint[] = [];
  getMonthsInRange(startDate, endDate).forEach((date) => {
    const month = months.get(serializeDate(date));
    if (month) {
      data.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        "Months of Savings": (month?.cash * 12) / month?.expenses,
      });
    }
  });
  return (
    <Chart<EmergencyFundDataPoint>
      data={data}
      x="month"
      y="Months of Savings"
      tooltipFormatter={(value) =>
        parseFloat(value.toString()).toFixed(1) + " Months"
      }
      referenceRanges={[
        {
          color: "green",
          y1: 6,
        },
        {
          color: "yellow",
          y1: 3,
          y2: 6,
        },
        {
          color: "red",
          y2: 3,
        },
      ]}
    />
  );
};

export default EmergencyFund;

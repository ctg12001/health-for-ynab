import React from "react";
import { MonthMetrics } from "../../calculations/monthSummary";
import { getMonthsInRange, serializeDate } from "../../utils/date";
import Chart from "./Chart";

interface RetirementAgeProps {
  months: Map<string, MonthMetrics>;
  startDate: Date;
  endDate: Date;
}

interface RetirementAgeDataPoint {
  month: string;
  "Retirement Age": number;
}

const RetirementAge = (props: RetirementAgeProps) => {
  const { months, startDate, endDate } = props;
  const data: RetirementAgeDataPoint[] = [];
  getMonthsInRange(startDate, endDate).forEach((date) => {
    const month = months.get(serializeDate(date));
    if (month) {
      data.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        "Retirement Age": month.fiAge,
      });
    }
  });
  return (
    <Chart<RetirementAgeDataPoint>
      data={data}
      x="month"
      y="Retirement Age"
      tooltipFormatter={(value) =>
        parseFloat(value.toString()).toFixed(2) + " Years"
      }
      referenceRanges={[
        {
          color: "green",
          y2: 55,
        },
        {
          color: "yellow",
          y1: 55,
          y2: 65,
        },
        {
          color: "red",
          y1: 65,
        },
      ]}
    />
  );
};

export default RetirementAge;

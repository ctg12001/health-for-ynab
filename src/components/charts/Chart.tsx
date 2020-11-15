import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  YAxis,
  ResponsiveContainer,
  TickFormatterFunction,
  TooltipFormatter,
  ReferenceArea,
} from "recharts";

interface ChartProps<T extends object> {
  data: T[];
  x: string;
  y: string;
  tickFormatter?: TickFormatterFunction;
  tooltipFormatter?: TooltipFormatter;
  referenceRanges?: {
    y1?: number;
    y2?: number;
    color: string;
  }[];
}

const Chart = <T extends object>(props: ChartProps<T>) => {
  const {
    data,
    x,
    y,
    tickFormatter,
    tooltipFormatter,
    referenceRanges,
  } = props;

  const referenceAreas = referenceRanges?.map((referenceRange) => {
    return (
      <ReferenceArea
        key={referenceRange.color}
        y1={referenceRange.y1}
        y2={referenceRange.y2}
        fill={referenceRange.color}
        fillOpacity={0.15}
        alwaysShow
      />
    );
  });

  return (
    <>
      <ResponsiveContainer height={250}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          syncId="chart"
        >
          <XAxis dataKey={x} />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip formatter={tooltipFormatter} />
          <Line type="monotone" dataKey={y} stroke="#8884d8" strokeWidth={2} />
          {referenceAreas}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default Chart;

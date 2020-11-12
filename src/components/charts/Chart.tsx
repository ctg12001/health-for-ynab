import { Typography } from "@material-ui/core";
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
  YAxis,
  ResponsiveContainer,
  TickFormatterFunction,
  TooltipFormatter,
} from "recharts";

interface ChartProps<T extends object> {
  title: string;
  data: T[];
  x: string;
  y: string;
  tickFormatter?: TickFormatterFunction;
  tooltipFormatter?: TooltipFormatter;
}

const Chart = <T extends object>(props: ChartProps<T>) => {
  const { data, title, x, y, tickFormatter, tooltipFormatter } = props;

  return (
    <>
      <Typography variant="h6" gutterBottom align="center">
        {title}
      </Typography>
      <ResponsiveContainer height={250}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x} />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip formatter={tooltipFormatter} />
          <Line type="monotone" dataKey={y} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default Chart;

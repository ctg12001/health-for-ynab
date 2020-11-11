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
} from "recharts";
import { numberToCurrency } from "../utils/text";

interface DataPoint {
  name: string;
  cash: number;
}

interface ChartProps {
  title: string;
  data: DataPoint[];
}

const Chart = (props: ChartProps) => {
  const { data, title } = props;

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
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => numberToCurrency(value)} />
          <Tooltip
            formatter={(value) => numberToCurrency(parseInt(value.toString()))}
          />
          <Line type="monotone" dataKey="cash" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default Chart;

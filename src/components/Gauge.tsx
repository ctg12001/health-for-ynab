import { Typography } from "@material-ui/core";
import React, { CSSProperties } from "react";
import GaugeChart from "react-gauge-chart";

interface GaugeProps {
  id: string;
  title: string;
  value: number;
  ranges: [number, number, number, number];
  formatLabel?(value: string): string;
  reverseColors?: boolean;
}

const Gauge = (props: GaugeProps) => {
  const { id, title, value, ranges, formatLabel, reverseColors } = props;

  const GaugeStyle: CSSProperties = {
    backgroundColor: "white",
  };

  const colors = ["#EA4228", "#F5CD19", "#5BE12C"];
  if (reverseColors) {
    colors.reverse();
  }

  const totalArc = ranges[3] - ranges[0];

  return (
    <>
      <Typography variant="h6" gutterBottom align="center">
        {title}
      </Typography>
      <GaugeChart
        id={id}
        nrOfLevels={420}
        arcsLength={[
          (ranges[1] - ranges[0]) / totalArc,
          (ranges[2] - ranges[1]) / totalArc,
          (ranges[3] - ranges[2]) / totalArc,
        ]}
        colors={colors}
        percent={(value - ranges[0]) / totalArc}
        arcPadding={0.02}
        style={GaugeStyle}
        textColor={"#444"}
        formatTextValue={
          formatLabel
            ? formatLabel
            : (valueText: string) => (value * 100).toFixed(2) + "%"
        }
      />
    </>
  );
};

export default Gauge;

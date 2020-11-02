import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { getYearsInRange } from '../utils/date';
import { DateRange } from '../types/CommonProps';

interface DateButton {
  key: string;
  text: string;
  start: Date;
  end: Date;
};

interface DatePickerProps {
  minDate: Date;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}

const DatePicker = (props: DatePickerProps) => {
  const {minDate, setDateRange} = props;

  const [selected, setSelected] = useState<string>("last");

  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastYear = new Date(lastMonth.getFullYear() - 1, lastMonth.getMonth(), 1);

  const dateButtonConfigs: DateButton[] = [
    {
      key: "last",
      text: "Last 12 Months",
      start: lastYear,
      end: lastMonth
    },
    {
      key: "ytd",
      text: "Year to Date",
      start: new Date(today.getFullYear(), 0, 1),
      end: lastMonth
    },
  ];

  getYearsInRange(minDate, lastYear).reverse().forEach( (yearDate) => {
    const year = yearDate.getFullYear();
    const yearString: string = year + "";
    dateButtonConfigs.push({
      key: yearString,
      text: yearString,
      start: new Date(year, 0, 1),
      end: new Date(year, 11, 1)
    });
  });

  const dateButtons = dateButtonConfigs.map( (dateButtonConfig) => {
    return <Grid item key={dateButtonConfig.key}>
      <Button
        variant="contained"
        color={selected === dateButtonConfig.key ? "primary" : "default"}
        onClick={() => {
          setSelected(dateButtonConfig.key);
          setDateRange({
            startDate: dateButtonConfig.start,
            endDate: dateButtonConfig.end
          });
        }}
      >
        {dateButtonConfig.text}
      </Button>
    </Grid>
  });

  return (
    <Grid container justify="flex-end" spacing={1}>
      {dateButtons}
    </Grid>
  );
};

export default DatePicker;
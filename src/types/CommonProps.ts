import { api } from "ynab";

export interface DateRange {
  startDate: Date;
  endDate: Date;  
}

export interface CommonProps {
  ynabAPI: api;
  dateRange: DateRange;
}
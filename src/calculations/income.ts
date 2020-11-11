import { MonthDetail } from "ynab";
import { getMonthsInRange, serializeDate } from "../utils/date";

export const calculateIncome = (
  months: Map<string, MonthDetail>,
  startDate: Date,
  endDate: Date
): number => {
  let income = 0;
  getMonthsInRange(startDate, endDate).forEach((month) => {
    const monthDetail = months.get(serializeDate(month));
    if (monthDetail == null) {
      return;
    }
    income += monthDetail.income;
  });

  return income;
};

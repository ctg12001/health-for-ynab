import { MonthDetail } from "ynab";
import { getMonthsInRange, serializeDate } from "../utils/date";

export const calculateCash = (
  months: Map<string, MonthDetail>,
  month: Date
): number => {
  const monthDetail = months.get(serializeDate(month));

  if (monthDetail == null) {
    return 0;
  }

  let cash: number = monthDetail.to_be_budgeted;
  monthDetail.categories.forEach((category) => {
    if (category.name !== "Inflows") {
      cash += category.balance;
    }
  });

  return cash;
};

export const calculateCashHistory = (
  months: Map<string, MonthDetail>,
  startMonth: Date,
  endMonth: Date
) => {
  return getMonthsInRange(startMonth, endMonth).map((month: Date) => {
    return {
      name: month.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      cash: calculateCash(months, month),
    };
  });
};

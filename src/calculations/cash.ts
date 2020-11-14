import { MonthDetail } from "ynab";
import { serializeDate } from "../utils/date";

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

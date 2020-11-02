import { Account, MonthDetail } from "ynab";
import { getMonthsInRange, serializeDate } from "../utils/date";
import { anyMapValues } from "../utils/list";

export const calculateExpenses = (months: Map<string, MonthDetail>, accounts: Map<string, Account>, startDate: Date, endDate: Date): number => {
  let expenses = 0;
  getMonthsInRange(startDate, endDate).forEach((month) => {
    const monthDetail = months.get(serializeDate(month));
    if (monthDetail == null) {
      return;
    }
    monthDetail.categories.forEach((category) => {
      // Add to expenses if category is not a credit card type
      if (!anyMapValues(accounts, (account: Account) => {
        return category.name === "Inflows" || (account.name === category.name && account.type === Account.TypeEnum.CreditCard);
      })) {
        expenses += category.activity;
      }
    });
  });

  return -1 * expenses;
};
import { MonthDetail } from "ynab";
import { getMonthsInRange, serializeDate } from "../utils/date";

export const calculateDebtPayment = (
  months: Map<string, MonthDetail>,
  startDate: Date,
  endDate: Date
): number => {
  let debtPayments = 0;
  getMonthsInRange(startDate, endDate).forEach((month) => {
    const monthDetail = months.get(serializeDate(month));
    if (monthDetail == null) {
      return;
    }
    monthDetail.categories.forEach((category) => {
      // Add to debt payments if it is a debt category
      if (category.name === "Rent" || category.name === "Student Loans") {
        debtPayments += category.activity;
      }
    });
  });

  return -1 * debtPayments;
};

import { Account, MonthDetail, TransactionDetail } from "ynab";
import { addMonths, monthsBetweenDates, serializeDate } from "../utils/date";
import { calculateCash } from "./cash";
import { calculateExpenses } from "./expenses";
import { calculateIncome } from "./income";
import {
  calculateRetirementContributions,
  calculateRetirementTransfers,
} from "./retirement";

export interface MonthMetrics {
  income: number;
  expenses: number;
  retirementContributions: number;
  cash: number;
}

export const summarizeMonth = (
  months: Map<string, MonthDetail>,
  accounts: Map<string, Account>,
  transactions: TransactionDetail[],
  startDate: Date,
  endDate: Date
): MonthMetrics => {
  const retirementContributions = calculateRetirementContributions(
    accounts,
    transactions,
    startDate,
    endDate
  );
  const retirementTransfers = calculateRetirementTransfers(
    accounts,
    transactions,
    startDate,
    endDate
  );
  return {
    income:
      calculateIncome(months, startDate, endDate) +
      retirementContributions -
      retirementTransfers,
    expenses:
      calculateExpenses(months, accounts, startDate, endDate) -
      retirementTransfers,
    retirementContributions,
    cash: calculateCash(months, endDate),
  };
};

export const summarizeMonths = (
  months: Map<string, MonthDetail>,
  accounts: Map<string, Account>,
  transactions: TransactionDetail[],
  startDate: Date,
  endDate: Date
): Map<string, MonthMetrics> => {
  const monthSummaries = new Map<string, MonthMetrics>();

  let endRangeDate = addMonths(startDate, 3);
  while (endRangeDate <= endDate) {
    monthSummaries.set(
      serializeDate(endRangeDate),
      summarizeMonth(months, accounts, transactions, startDate, endRangeDate)
    );

    endRangeDate = addMonths(endRangeDate, 1);

    if (monthsBetweenDates(startDate, endRangeDate) > 12) {
      startDate = addMonths(startDate, 1);
    }
  }

  return monthSummaries;
};

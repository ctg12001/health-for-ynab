import { Account, MonthDetail, TransactionDetail } from "ynab";
import { addMonths, monthsBetweenDates, serializeDate } from "../utils/date";
import { calculateCash } from "./cash";
import { calculateExpenses } from "./expenses";
import { calculateFIAge } from "./fiAge";
import { calculateIncome } from "./income";
import {
  calculateRetirementBalance,
  calculateRetirementContributions,
  calculateRetirementTransfers,
} from "./retirement";

export interface MonthMetrics {
  income: number;
  expenses: number;
  retirementContributions: number;
  cash: number;
  fiAge: number;
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

  const retirementBalance = calculateRetirementBalance(
    accounts,
    transactions,
    endDate
  );

  const expenses =
    calculateExpenses(months, accounts, startDate, endDate) -
    retirementTransfers;
  return {
    income:
      calculateIncome(months, startDate, endDate) +
      retirementContributions -
      retirementTransfers,
    expenses,
    retirementContributions,
    cash: calculateCash(months, endDate),
    fiAge: calculateFIAge(
      retirementBalance,
      expenses,
      retirementContributions,
      0.06,
      0.04
    ),
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

  let endRangeDate = addMonths(startDate, 12);
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

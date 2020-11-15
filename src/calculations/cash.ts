import { Account, TransactionDetail } from "ynab";
import { stringToDate } from "../utils/date";
import { filterMapValues } from "../utils/list";

export const calculateCash = (
  accounts: Map<string, Account>,
  transactions: TransactionDetail[],
  month: Date
): number => {
  let cash = 0;
  const budgetAccountIDs = filterMapValues(accounts, (account) => {
    return account.on_budget;
  }).map((account) => {
    return account.id;
  });

  transactions
    .filter((transaction) => {
      const transactionDate = stringToDate(transaction.date);
      return (
        budgetAccountIDs.includes(transaction.account_id) &&
        transactionDate < month
      );
    })
    .forEach((transaction) => {
      cash += transaction.amount;
    });

  return cash;
};

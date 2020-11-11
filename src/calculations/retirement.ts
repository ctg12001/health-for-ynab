import { Account, TransactionDetail } from "ynab";
import { stringToDate } from "../utils/date";
import { filterMapValues } from "../utils/list";

export const calculateRetirementContributions = (accounts: Map<string, Account>, transactions: TransactionDetail[], startDate: Date, endDate: Date): number => {
  let contributions = 0;

  _getRetirementTransactions(accounts, transactions, startDate, endDate).filter((transaction) => {
    return transaction.payee_name && transaction.payee_name !== "Investment Returns";
  }).forEach((transaction) => {
    contributions += transaction.amount;
  });

  return contributions;
};

export const calculateRetirementTransfers = (accounts: Map<string, Account>, transactions: TransactionDetail[], startDate: Date, endDate: Date): number => {
  let transfers = 0;

  _getRetirementTransactions(accounts, transactions, startDate, endDate).filter((transaction) => {
    return transaction.payee_name?.includes("Transfer");
  }).forEach((transaction) => {
    transfers += transaction.amount;
  });

  return transfers;
};

const _getRetirementTransactions = (accounts: Map<string, Account>, transactions: TransactionDetail[], startDate: Date, endDate: Date): TransactionDetail[] => {
  const retirementAccountIDs = filterMapValues(accounts, (account) => {
    return account.type === Account.TypeEnum.OtherAsset && !account.name.includes("ESPP");
  }).map((account) => {
    return account.id;
  });

  return transactions.filter((transaction) => {
    const transactionDate = stringToDate(transaction.date);
    return retirementAccountIDs.includes(transaction.account_id) && transactionDate > startDate && transactionDate < endDate;
  });
};
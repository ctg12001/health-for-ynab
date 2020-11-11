import React from "react";
import { Account, MonthDetail, MonthSummary, TransactionDetail } from "ynab";

export interface BudgetData {
  accounts: Map<string, Account>;
  monthSummaries: MonthSummary[];
  monthDetails: Map<string, MonthDetail>;
  transactions: TransactionDetail[];
}

const BudgetDataContext = React.createContext<BudgetData>({
  accounts: new Map<string, Account>(),
  monthSummaries: [],
  monthDetails: new Map<string, MonthDetail>(),
  transactions: [],
});

export const BudgetDataProvider = BudgetDataContext.Provider;
export const BudgetDataConsumer = BudgetDataContext.Consumer;
export default BudgetDataContext;

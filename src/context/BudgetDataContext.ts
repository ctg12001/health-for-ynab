import React from "react";
import { Account, MonthDetail, MonthSummary } from 'ynab';

export interface BudgetData {
    accounts: Map<string, Account>;
    monthSummaries: MonthSummary[];
    monthDetails: Map<string, MonthDetail>;
}

const BudgetDataContext = React.createContext<BudgetData>({
    accounts: new Map<string, Account>(),
    monthSummaries: [],
    monthDetails: new Map<string, MonthDetail>(),
});

export const BudgetDataProvider = BudgetDataContext.Provider;
export const BudgetDataConsumer = BudgetDataContext.Consumer;
export default BudgetDataContext;

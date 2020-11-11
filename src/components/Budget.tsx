import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { utils, Account, MonthDetail, MonthSummary, api } from 'ynab';
import { BudgetData, BudgetDataProvider } from '../context/BudgetDataContext';
import { DateRange } from '../types/CommonProps';
import DatePicker from './DatePicker';
import Summary from './Summary';
import { serializeDate, stringToDate } from '../utils/date';
import { asyncForEach } from '../utils/list';

interface Params {
  budgetId: string;
}

const Budget = (props: { ynabAPI: api }) => {
  const { ynabAPI } = props;
  const { budgetId } = useParams<Params>();

  const [budgetData, setBudgetData] = useState<BudgetData>({
    accounts: new Map<string, Account>(),
    monthSummaries: [],
    monthDetails: new Map<string, MonthDetail>(),
    transactions: [],
  });

  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(today.getFullYear() - 1, today.getMonth() - 1, 1),
    endDate: new Date(today.getFullYear(), today.getMonth() - 1, 1)
  });

  let [minDate, setMinDate] = useState<Date>(new Date());

  const getAccounts = useCallback(async () => {
    if (budgetData.accounts.size > 0) {
      return budgetData.accounts;
    }
    
    const accounts = await ynabAPI.accounts.getAccounts(budgetId).then((accountsResponse) => {
      const accountMap = budgetData.accounts;
      accountsResponse.data.accounts.forEach((account: Account) => {
        accountMap.set(account.id, account);
      });
      return accountMap;
    });
    return accounts;
  }, [budgetId, ynabAPI.accounts]);

  const getMonthSummaries = useCallback(async () => {
    if (budgetData.monthSummaries.length > 0) {
      return budgetData.monthSummaries;
    }

    const monthSummaries = await ynabAPI.months.getBudgetMonths(budgetId).then((monthsResponse) => {
      return monthsResponse.data.months;
    });

    return monthSummaries;
  }, [budgetId, ynabAPI.months]);

  const getTransactions = useCallback(async () => {
    if (budgetData.transactions.length > 0) {
      return budgetData.transactions;
    }

    const transactions = await ynabAPI.transactions.getTransactions(budgetId).then((transactionsResponse) => {
      return transactionsResponse.data.transactions;
    });

    return transactions;
  }, [budgetId, ynabAPI.transactions]);

  const getMissingMonthDetails = useCallback(async (monthsToFetch: MonthSummary[]) => {
    const monthDetails: MonthDetail[] = [];
    await asyncForEach(monthsToFetch, async (month) => {
      const monthResponse = await ynabAPI.months.getBudgetMonth(budgetId, utils.convertFromISODateString(month.month));
      monthDetails.push(monthResponse.data.month);
    });
    return monthDetails;
  }, [budgetId, ynabAPI.months]);

  useEffect(() => {
    Promise.all([
      getAccounts(),
      getMonthSummaries(),
      getTransactions()
    ]).then(([
      accountMap,
      monthSummaries,
      transactions
    ]) => {
      let minMonthDate = new Date();
      const monthsToFetch = monthSummaries.filter((month) => {
        const monthDate = stringToDate(month.month);
        minMonthDate = minMonthDate < monthDate ? minMonthDate : monthDate;
        return (!budgetData.monthDetails.has(serializeDate(monthDate)) && monthDate >= dateRange.startDate && monthDate <= dateRange.endDate);
      });

      getMissingMonthDetails(monthsToFetch).then((monthDetails) => {
        const monthDetailMap = budgetData.monthDetails;
        monthDetails.forEach((monthDetail) => {
          monthDetailMap.set(serializeDate(monthDetail.month), monthDetail);
        });

        setMinDate(minMonthDate);
        setBudgetData({
          accounts: accountMap,
          monthSummaries: monthSummaries,
          monthDetails: monthDetailMap,
          transactions,
        });
      });
    }, () => {});
  }, [dateRange.endDate, dateRange.startDate, getAccounts, getMissingMonthDetails, getMonthSummaries, getTransactions]);

  return <BudgetDataProvider value={budgetData}>
    <DatePicker minDate={minDate} setDateRange={setDateRange}/>
    <Summary ynabAPI={ynabAPI} dateRange={dateRange}/>
  </BudgetDataProvider>
};

export default Budget;
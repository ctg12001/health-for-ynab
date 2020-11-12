import React, { useContext, useEffect, useState } from "react";
import BudgetDataContext from "../context/BudgetDataContext";
import { CommonProps } from "../types/CommonProps";
import Gauge from "./Gauge";
import { Grid } from "@material-ui/core";
import CurrencyDisplay from "./CurrencyDisplay";
import { addMonths, monthsBetweenDates } from "../utils/date";
import {
  MonthMetrics,
  summarizeMonth,
  summarizeMonths,
} from "../calculations/monthSummary";
import IncomeSaved from "./charts/IncomeSaved";
import EmergencyFund from "./charts/EmergencyFund";

const Summary = (props: CommonProps) => {
  const { dateRange } = props;

  const budgetData = useContext(BudgetDataContext);

  const [calculations, setCalculations] = useState<MonthMetrics>();
  const [monthSummaries, setMonthSummaries] = useState<
    Map<string, MonthMetrics>
  >();

  useEffect(() => {
    setCalculations(
      summarizeMonth(
        budgetData.monthDetails,
        budgetData.accounts,
        budgetData.transactions,
        dateRange.startDate,
        dateRange.endDate
      )
    );

    setMonthSummaries(
      summarizeMonths(
        budgetData.monthDetails,
        budgetData.accounts,
        budgetData.transactions,
        addMonths(dateRange.startDate, -12),
        dateRange.endDate
      )
    );
  }, [budgetData, dateRange]);

  return (
    <Grid container spacing={2}>
      {calculations?.income ? (
        <>
          <Grid item xs={3}>
            <CurrencyDisplay amount={calculations.income} title="Income" />
          </Grid>
          <Grid item xs={3}>
            <CurrencyDisplay amount={calculations.expenses} title="Expenses" />
          </Grid>
          <Grid item xs={3}>
            <CurrencyDisplay amount={calculations.cash} title="Cash" />
          </Grid>
          <Grid item xs={3}>
            <CurrencyDisplay
              amount={calculations.retirementContributions}
              title="Retirement Contributions"
            />
          </Grid>
          <Grid item xs={6}>
            <Gauge
              id="income"
              title="% of Income Saved"
              value={
                (calculations.income - calculations.expenses) /
                calculations.income
              }
              ranges={[-0.2, 0.05, 0.2, 0.5]}
            />
          </Grid>
          <Grid item xs={6}>
            <Gauge
              id="cash"
              title="Emergency Fund"
              value={
                (monthsBetweenDates(dateRange.startDate, dateRange.endDate) *
                  calculations.cash) /
                calculations.expenses
              }
              formatLabel={(value: string) =>
                (parseInt(value) * 12) / 100 + " Months"
              }
              ranges={[0, 3, 6, 12]}
            />
          </Grid>
        </>
      ) : (
        <></>
      )}
      {monthSummaries ? (
        <>
          <Grid item xs={6}>
            <IncomeSaved
              months={monthSummaries}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </Grid>
          <Grid item xs={6}>
            <EmergencyFund
              months={monthSummaries}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </Grid>
        </>
      ) : (
        <></>
      )}
    </Grid>
  );
};

export default Summary;

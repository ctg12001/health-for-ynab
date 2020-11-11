import React, { useContext, useEffect, useState } from "react";
import BudgetDataContext from "../context/BudgetDataContext";
import { calculateIncome } from "../calculations/income";
import { CommonProps } from "../types/CommonProps";
import { calculateExpenses } from "../calculations/expenses";
import { calculateCash } from "../calculations/cash";
import Gauge from "./Gauge";
import { Grid } from "@material-ui/core";
import CurrencyDisplay from "./CurrencyDisplay";
import {
  calculateRetirementContributions,
  calculateRetirementTransfers,
} from "../calculations/retirement";
import { monthsBetweenDates } from "../utils/date";

export interface Calculations {
  income: number;
  expenses: number;
  cash: number;
  retirementContributions: number;
}

const Summary = (props: CommonProps) => {
  const { dateRange } = props;

  const budgetData = useContext(BudgetDataContext);

  const [calculations, setCalculations] = useState<Calculations>();

  useEffect(() => {
    const retirementContributions = calculateRetirementContributions(
      budgetData.accounts,
      budgetData.transactions,
      dateRange.startDate,
      dateRange.endDate
    );
    const retirementTransfers = calculateRetirementTransfers(
      budgetData.accounts,
      budgetData.transactions,
      dateRange.startDate,
      dateRange.endDate
    );

    setCalculations({
      income:
        calculateIncome(
          budgetData.monthDetails,
          dateRange.startDate,
          dateRange.endDate
        ) +
        retirementContributions -
        retirementTransfers,
      expenses:
        calculateExpenses(
          budgetData.monthDetails,
          budgetData.accounts,
          dateRange.startDate,
          dateRange.endDate
        ) - retirementTransfers,
      cash: calculateCash(budgetData.monthDetails, dateRange.endDate),
      retirementContributions,
    });
  }, [budgetData, dateRange]);

  return (
    <>
      {calculations?.income ? (
        <Grid container spacing={2}>
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
        </Grid>
      ) : (
        <></>
      )}
    </>
  );
};

export default Summary;

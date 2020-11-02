import React, { useContext, useEffect, useState } from "react";
import BudgetDataContext from "../context/BudgetDataContext";
import { calculateIncome } from "../calculations/income";
import { CommonProps } from "../types/CommonProps";
import { calculateExpenses } from "../calculations/expenses";
import { calculateCash } from "../calculations/cash";
import Gauge from "./Gauge";
import { Grid } from "@material-ui/core";

export interface Calculations {
  income: number;
  expenses: number;
  cash: number;
};

const Summary = (props: CommonProps) => {
    const { dateRange } = props;

    const budgetData = useContext(BudgetDataContext);

    const [calculations, setCalculations] = useState<Calculations>();

    useEffect(() => {
      setCalculations({
        income: calculateIncome(budgetData.monthDetails, dateRange.startDate, dateRange.endDate),
        expenses: calculateExpenses(budgetData.monthDetails, budgetData.accounts, dateRange.startDate, dateRange.endDate),
        cash: calculateCash(budgetData.monthDetails, dateRange.endDate),
      });
      console.log({
        income: calculateIncome(budgetData.monthDetails, dateRange.startDate, dateRange.endDate),
        expenses: calculateExpenses(budgetData.monthDetails, budgetData.accounts, dateRange.startDate, dateRange.endDate),
        cash: calculateCash(budgetData.monthDetails, dateRange.endDate),
      });
    }, [budgetData, dateRange]);

    return (
      <>
      {calculations?.income ?
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Gauge
              id="income"
              title="% of Income Saved"
              value={(calculations.income - calculations.expenses) * 100 / calculations.income}
              ranges={[0, 5, 20, 50]}
            />
          </Grid>
          <Grid item xs={6}>
            <Gauge
              id="cash"
              title="Emergency Fund"
              value={(12 * calculations.cash / calculations.expenses)}
              formatLabel={(value: string) => (parseInt(value) * 12 / 100) + " Months"}
              ranges={[0, 3, 6, 12]}
            />
          </Grid>

        </Grid> : <></>}
      </>
    );
}

export default Summary;
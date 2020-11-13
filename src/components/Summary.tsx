import React, { useContext, useEffect, useState } from "react";
import BudgetDataContext from "../context/BudgetDataContext";
import { CommonProps } from "../types/CommonProps";
import Gauge from "./Gauge";
import { Grid, Paper } from "@material-ui/core";
import CurrencyDisplay from "./CurrencyDisplay";
import { addMonths, monthsBetweenDates } from "../utils/date";
import {
  MonthMetrics,
  summarizeMonth,
  summarizeMonths,
} from "../calculations/monthSummary";
import IncomeSaved from "./charts/IncomeSaved";
import EmergencyFund from "./charts/EmergencyFund";
import RetirementAge from "./charts/RetirementAge";

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
      {calculations?.income && monthSummaries ? (
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
          <Grid item xs={4}>
            <Paper>
              <Grid item xs={12}>
                <Gauge
                  id="income"
                  title="% of Income Saved"
                  value={
                    (calculations.income - calculations.expenses) /
                    calculations.income
                  }
                  ranges={[-0.2, 0.05, 0.2, 0.5]}
                />
                <Grid item xs={12}>
                  <IncomeSaved
                    months={monthSummaries}
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper>
              <Grid item xs={12}>
                <Gauge
                  id="cash"
                  title="Emergency Fund"
                  value={
                    (monthsBetweenDates(
                      dateRange.startDate,
                      dateRange.endDate
                    ) *
                      calculations.cash) /
                    calculations.expenses
                  }
                  formatLabel={(value: string) =>
                    (parseFloat(value) * 12) / 100 + " Months"
                  }
                  ranges={[0, 3, 6, 12]}
                />
              </Grid>
              <Grid item xs={12}>
                <EmergencyFund
                  months={monthSummaries}
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                />
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper>
              <Grid item xs={12}>
                <Gauge
                  id="fiAge"
                  title="Retirement Age"
                  value={calculations.fiAge}
                  formatLabel={(value: string) =>
                    (40 + (parseFloat(value) * 45) / 100).toFixed(1) +
                    " Years Old"
                  }
                  ranges={[40, 55, 65, 85]}
                  reverseColors
                />
              </Grid>
              <Grid item xs={12}>
                <RetirementAge
                  months={monthSummaries}
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                />
              </Grid>
            </Paper>
          </Grid>
        </>
      ) : (
        <></>
      )}
    </Grid>
  );
};

export default Summary;

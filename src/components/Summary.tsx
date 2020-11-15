import React, { useContext, useEffect, useState } from "react";
import BudgetDataContext from "../context/BudgetDataContext";
import { CommonProps } from "../types/CommonProps";
import Gauge from "./Gauge";
import { CircularProgress, Grid, makeStyles, Paper } from "@material-ui/core";
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
import Debt from "./charts/Debt";

interface SummaryProps extends CommonProps {
  isLoading: boolean;
}

const useStyles = makeStyles((theme) => ({
  overlay: {
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 999,
  },
}));

const Summary = (props: SummaryProps) => {
  const { dateRange, isLoading } = props;
  const classes = useStyles();

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
    <>
      {isLoading ? (
        <Grid
          container
          className={classes.overlay}
          alignItems="center"
          justify="center"
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
      {calculations?.income && monthSummaries ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs>
              <CurrencyDisplay amount={calculations.income} title="Income" />
            </Grid>
            <Grid item xs>
              <CurrencyDisplay
                amount={calculations.expenses}
                title="Expenses"
              />
            </Grid>
            <Grid item xs>
              <CurrencyDisplay amount={calculations.cash} title="Cash" />
            </Grid>
            <Grid item xs>
              <CurrencyDisplay
                amount={calculations.retirementContributions}
                title="Retirement Contributions"
              />
            </Grid>
            <Grid item xs>
              <CurrencyDisplay
                amount={calculations.debtPayments}
                title="Debt Payments"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={3}>
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
            <Grid item xs={3}>
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
                      ((parseFloat(value) * 12) / 100).toFixed(1) + " Months"
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
            <Grid item xs={3}>
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
            <Grid item xs={3}>
              <Paper>
                <Grid item xs={12}>
                  <Gauge
                    id="debt"
                    title="Debt/Income Ratio"
                    value={calculations.debtPayments / calculations.income}
                    ranges={[0, 0.25, 0.4, 0.6]}
                    reverseColors
                  />
                </Grid>
                <Grid item xs={12}>
                  <Debt
                    months={monthSummaries}
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                  />
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Summary;

import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, BudgetSummary } from "ynab";

const useStyles = makeStyles((theme) => ({
  button: {
    height: theme.spacing(10),
    width: theme.spacing(20),
  },
}));

const BudgetSelect = (props: { ynabAPI: api }) => {
  const { ynabAPI } = props;
  const classes = useStyles();

  const [budgets, setBudgets] = useState<BudgetSummary[]>([]);

  useEffect(() => {
    ynabAPI.budgets.getBudgets().then(
      (budgetResponse) => {
        setBudgets(budgetResponse.data.budgets);
      },
      () => {}
    );
  }, [ynabAPI.budgets]);

  console.log(budgets);
  const budgetButtons = budgets.map((budget) => {
    return (
      <Grid item key={budget.id}>
        <Link to={`/${budget.id}`} style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            {budget.name}
          </Button>
        </Link>
      </Grid>
    );
  });

  return (
    <>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Choose a budget
          </Typography>
        </Grid>
      </Grid>
      <Grid container justify="space-evenly">
        {budgetButtons}
      </Grid>
    </>
  );
};

export default BudgetSelect;

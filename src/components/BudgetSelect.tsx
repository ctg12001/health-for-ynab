import { Button, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, BudgetSummary } from 'ynab';

const BudgetSelect = (props: { ynabAPI: api }) => {
  const { ynabAPI } = props;
  const [budgets, setBudgets] = useState<BudgetSummary[]>([]);

  useEffect(() => {
    ynabAPI.budgets.getBudgets().then((budgetResponse) => {
      setBudgets(budgetResponse.data.budgets)
    }, () => {});
  }, [ynabAPI.budgets]);

  const budgetButtons = budgets.map((budget) => {
    return <Link
        key={budget.id}
        to={`/${budget.id}`}
        style={{ textDecoration: 'none', paddingRight: "10px" }}
    >
        <Button variant="outlined">
            {budget.name}
        </Button>
    </Link>
  });

  return (
    <div className="App">
      <Typography variant="h3" gutterBottom>
        Choose a budget
      </Typography>
      {budgetButtons}
    </div>
  );
}

export default BudgetSelect;

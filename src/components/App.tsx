import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import BudgetSelect from "./BudgetSelect";
import * as ynab from "ynab";
import Budget from "./Budget";

const App = () => {
  const accessToken: string = "hidden";
  const ynabAPI = new ynab.API(accessToken);

  return (
    <Router>
      <Switch>
        <Route path="/:budgetId">
          <Budget ynabAPI={ynabAPI} />
        </Route>
        <Route path="/">
          <BudgetSelect ynabAPI={ynabAPI} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;

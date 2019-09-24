import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "../pages/Home";
import Calculator from "../pages/Caclulator";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home}></Route>
        <Route path="/calculator" exact component={Calculator}></Route>
      </Switch>
    </Router>
  );
};

export default App;

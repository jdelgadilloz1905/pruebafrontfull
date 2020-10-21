import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//IMPORTAR LOS COMPONENTES
import Login from "./Login";
import Register from "./Register";

class Router extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/" component={Login} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;

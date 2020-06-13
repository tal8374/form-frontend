import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import './App.css';
import Header from './components/Header/Header';

import FormList from './pages/FormList/FormList';
import FormSubmit from './pages/FormSubmit/FormSubmit';
import FormSubmissions from './pages/FormSubmissions/FormSubmissions';
import FormBuilder from './pages/FormBuilder/FormBuilder';

class App extends Component {
  render() {
    return (
      <React.Fragment>

        <BrowserRouter>
          <Header></Header>
          <div className="appContainer container">
            <Switch>
              <Route path="/form-list">
                <FormList />
              </Route>
              <Route path="/form-build">
                <FormBuilder></FormBuilder>
              </Route>
              <Route path="/form-submit/:formId" render={(props) => <FormSubmit {...props} />}></Route>
              <Route path="/submission-page/:formId" render={(props) => <FormSubmissions {...props} />}></Route>
              <Redirect to="/form-list" />
            </Switch>
          </div>

        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;

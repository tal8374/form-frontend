import React, { Component } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './App.css';
import FormListPage from './containers/formListPage/formListPage';
import FormBuilderPage from './containers/formBuilderPage/formBuilderPage';
import FormSubmitPage from './containers/formSubmitPage/formSubmitPage';
import FormSubmissionsPage from './containers/formSubmissionsPage/formSubmissionsPage';
import Header from './components/header/header';

class App extends Component {
  render() {
    return (
      <React.Fragment>

        <BrowserRouter>
          <Header></Header>
          <div className="appContainer container">
            <Switch>
              <Route path="/form-list">
                <FormListPage></FormListPage>
              </Route>
              <Route path="/form-build">
                <FormBuilderPage></FormBuilderPage>
              </Route>
              <Route path="/form-submit/:formId" render={(props) => <FormSubmitPage {...props} />}></Route>
              <Route path="/submission-page/:formId" render={(props) => <FormSubmissionsPage {...props} />}></Route>
              <Redirect to="/form-list" />
            </Switch>
          </div>

        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;

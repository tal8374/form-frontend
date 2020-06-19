import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from "react-router-dom";

import './App.css';
import Header from './components/Header/Header';

import FormList from './pages/FormList/FormList';
import FormSubmit from './pages/FormSubmit/FormSubmit';
import FormSubmissions from './pages/FormSubmissions/FormSubmissions';
import FormBuilder from './pages/FormBuilder/FormBuilder';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

import { AuthProvider } from './shared/AuthContext'
import AuthRoute from './shared/ProtectedRoute'

const App = () => {

  return (
    <React.Fragment>
      <Router>
        <AuthProvider>
          <Header></Header>
          <div className="appContainer container">
            <Switch>
              <AuthRoute path="/login" shouldBeLoggedOut={true} component={Login} />
              <AuthRoute path="/register" shouldBeLoggedOut={true} component={Register} />
              <AuthRoute path="/form-list" shouldBeLoggedIn={true} component={FormList} />
              <AuthRoute path="/form-build" shouldBeLoggedIn={true} component={FormBuilder} />
              <AuthRoute path="/form-submit/:formId" component={FormSubmit} />
              <AuthRoute path="/submission-page/:formId" shouldBeLoggedIn={true} component={FormSubmissions} />
            </Switch>
          </div>
        </AuthProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;

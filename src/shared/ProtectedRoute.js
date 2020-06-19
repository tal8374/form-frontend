import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuthState } from './AuthContext'

const AuthRoute = ({ component: Component, ...rest }) => {

  const state = useAuthState();

  return (
    <Route
      render={props => {
        let currentComponent = <Component {...props} />;
        let redirectToLoginComponent = <Redirect to="/login" />;
        let redirectToFormListComponent = <Redirect to="/form-list" />;

        let shouldBeLoggedIn = rest.shouldBeLoggedIn;
        let shouldBeLoggedOut = rest.shouldBeLoggedOut;
        let isLoggedIn = state.isLoggedIn

        if (shouldBeLoggedIn && !isLoggedIn)
          return redirectToLoginComponent;
        if (shouldBeLoggedOut && isLoggedIn)
          return redirectToFormListComponent;

        return currentComponent;
      }}
      {...rest}
    />
  )
}

export default AuthRoute

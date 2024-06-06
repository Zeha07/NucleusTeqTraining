import React from 'react';
import { Route, Redirect } from 'react-router-dom';
function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = /* Check if the user is authenticated */ True;
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login_signup" />
      }
    />
  );
}
export default PrivateRoute;
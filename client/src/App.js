import React, { Fragment, useEffect } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import NotFound from './components/layout/NotFound';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-form/CreateProfile';
import Login from './components/auth/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Redux
import { Provider } from 'react-redux';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import store from './store';
import EditProfile from './components/profile-form/EditProfile';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import Routes from './components/routing/Routes';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar></Navbar>
          <Switch>
            <Route exact path='/' component={Landing}></Route>
            <Route component={Routes}></Route>
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;

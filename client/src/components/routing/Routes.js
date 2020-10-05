import React from 'react';
import '../../App.css';
import Navbar from '../layout/Navbar';
import Landing from '../layout/Landing';
import Register from '../auth/Register';
import Alert from '../layout/Alert';
import NotFound from '../layout/NotFound';
import Dashboard from '../dashboard/Dashboard';
import PrivateRoute from '../routing/PrivateRoute';
import CreateProfile from '../profile-form/CreateProfile';
import Login from '../auth/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Redux
import { Provider } from 'react-redux';
import { loadUser } from '../../actions/auth';
import setAuthToken from '../../utils/setAuthToken';
import store from '../../store';
import EditProfile from '../profile-form/EditProfile';
import AddExperience from '../profile-form/AddExperience';
import AddEducation from '../profile-form/AddEducation';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import Post from '../post/Post';

const Routes = () => {
  return (
    <section className='container'>
      <Alert></Alert>
      <Switch>
        <Route exact path='/register' component={Register}></Route>
        <Route exact path='/login' component={Login}></Route>
        <Route exact path='/profiles' component={Profiles}></Route>
        <Route exact path='/profile/:id' component={Profile}></Route>
        <PrivateRoute
          exact
          path='/dashboard'
          component={Dashboard}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path='/create-profile'
          component={CreateProfile}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path='/edit-profile'
          component={EditProfile}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path='/add-experience'
          component={AddExperience}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path='/add-education'
          component={AddEducation}
        ></PrivateRoute>
        <PrivateRoute exact path='/posts' component={Posts}></PrivateRoute>
        <PrivateRoute exact path='/posts/:id' component={Post}></PrivateRoute>
        <Route component={NotFound}></Route>
      </Switch>
    </section>
  );
};

export default Routes;

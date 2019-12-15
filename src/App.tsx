import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './Dashboard';
import Login from './Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
const App: React.FC = () => {

  return (
    <Router>
      <div>
        
        <Switch>

          <Route path="/login">

            <Login />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;


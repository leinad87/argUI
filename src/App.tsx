import React, { createContext, useReducer } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import Login from './Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {AppContextProvider} from "./AppContext";


const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login" children={<Login />} />
          <Route path="/">
            <AppContextProvider>
              <Dashboard />
            </AppContextProvider>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;


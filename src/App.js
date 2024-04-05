import React, {useState, useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from './components/Auth/Login';
import './App.css';


function App() {
  return (
    <div className="App">
      <LoginForm />
    </div>
  );
}

export default App;
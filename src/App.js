import React, {useState, useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from './components/Auth/Login';
import './App.css';


function App() {


//   useEffect(() => {
//   }, []);

  return (
    <div className="App">
      {/* <h1>{message}</h1> */}
      <LoginForm />
    </div>
  );
}

export default App;
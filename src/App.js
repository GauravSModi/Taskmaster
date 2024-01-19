import React, {useState, useEffect} from 'react';
import TodoList from './components/TodoList/TodoList';
import LoginForm from './components/Auth/Login';
import SignupForm from './components/Auth/Signup';
import './App.css';

function App() {
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  const handleToggleForm = () => {
    setIsLogin(prevState => !prevState);
  };

  return (
    <div className="App">
      <h1>{message}</h1>
      {isLogin ? <LoginForm /> : <SignupForm />}
      <button onClick={handleToggleForm} className='btn btn-secondary'>
        {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
      </button>
    </div>
  );
}

export default App;
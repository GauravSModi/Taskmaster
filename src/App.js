import React, {useState, useEffect} from 'react';
import TodoList from './components/TodoList/TodoList';
import './App.css';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);


  return (
    <div className="App">
      <h1>{message}</h1>
      <TodoList/>
    </div>
  );
}

export default App;

import React, {useState, useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from './components/Auth/Login';
import {jwtDecode} from 'jwt-decode';
import TodoApp from './components/TodoApp/TodoApp';
import './App.css';


function App() {

    const [signedIn, setSignedIn] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');

        if (!storedToken) return;
    
        // Decode JWT token to access expiration time
        const decoded = jwtDecode(storedToken);
        if (decoded.exp <= Date.now() / 1000) {
            localStorage.removeItem('jwt_token');
            return;
        }
        
        setToken(storedToken)
        setSignedIn(true);
    }, [])

    if (signedIn) {
        return <TodoApp token={token} className='w-100'/>;
    }

    return (
    <div className="App">
        <LoginForm />
    </div>
    );
}

export default App;
import React, { useState } from 'react';
import TodoApp from '../TodoApp/TodoApp';
import SignupForm from './Signup';
import logo from '../../logo.svg';
import './Auth.css';
import { url } from '../../index'

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [token, setToken] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    const checkEmpty = (user, pass) => {
        return user.length > 0 && pass.length > 0;
    };

    const createAlert = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
    };

    const destroyAlert = () => {
        setShowAlert(false);
        setAlertMessage(null);
    };

    const handleToggleForm = () => {
        setIsSignup(true);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        console.log("Login clicked");

        // Check if username or password fields are empty
        if (!checkEmpty(username, password)) {
            createAlert('Please fill in both the username and password fields.');
            return;
        }
        
        try {
            const response = await fetch(url + '/login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();

                setToken(data.token);

                // Move on to application
                setLoginSuccess(true);

            } else {
                // Login failed due to an error
                const errorData = await response.json();

                if (errorData.message.includes('unsuccessful')){
                    // Same thing atm, but can change it easily if different behaviours desired
                    if (errorData.message.includes('username')) {
                        createAlert('Incorrect username or password. Please try again.');
                    } else if (errorData.message.includes('password')) {
                        createAlert('Incorrect username or password. Please try again.');
                    }
                } else {
                    console.error("Login error: ", errorData.message);
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    if (loginSuccess) {
        console.log(token);

        if (token != null) return <TodoApp token={token}/>;
    }

    if (isSignup) {
        return <SignupForm />;
    }

    return (
        <div className="auth-form-container ">
            
            <img className="pb-5" src={logo} alt="My Logo" /> {/* Display the logo image */}
            <form onSubmit={handleLogin}>
                <div className='mb-3'>
                    {/* <label htmlFor='loginUsername' className='form-label float-start'>
                        Username
                    </label> */}
                    <input 
                        type='text'
                        id='loginUsername'
                        className='form-control fw-lighter'
                        value={username} 
                        onChange={event => setUsername(event.target.value)}
                        placeholder='Username'
                        maxLength={20}
                        autoFocus
                    />
                </div>
                <div className='mb-3'>
                    {/* <label htmlFor='loginPassword' className='form-label float-start'>
                        Password
                    </label> */}
                    <input 
                        type='password'
                        id='loginPassword'
                        className='form-control fw-lighter'
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        placeholder='Password'
                        maxLength={20}
                    />
                </div>
                <div className='mt-5'>
                    <button type='submit' className='btn btn-primary w-100' >Login</button>
                </div>
            </form>

            <div className='mt-2'>
                <button id='switchAuthButton' onClick={handleToggleForm} className='btn btn-link text-dark fw-light' type="button">
                Don't have an account? Sign Up
                </button>
            </div>

            {showAlert && (
                <div className="alert-container">
                    <div className="alert alert-warning alert-dismissible" role="alert">
                        {alertMessage}
                        <button type="button" className="btn-close" onClick={destroyAlert} aria-label="Close"></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginForm;

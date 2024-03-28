import React, { useState } from 'react';
import TodoApp from '../TodoApp/TodoApp';
import LoginForm from './Login';
import logo from '../../logo.svg';
import './Auth.css';
import { url } from '../../index'

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [showAlert, setShowAlert] = useState(false);


    const createAlert = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
    };

    const destroyAlert = () => {
        setShowAlert(false);
        setAlertMessage(null);
    };
    
    const validateUsername = (input) => {
        const minLength = 5;
        const maxLength = 20;
        const regex = /^[a-zA-Z0-9_]+$/;

        return input.length <= maxLength && input.length >= minLength && regex.test(input);
    };

    const validatePassword = (input) => {
        const minLength = 5;
        const maxLength = 20;
        const regex = /^[a-zA-Z0-9_!@#$%^&*()-]+$/;

        return input.length <= maxLength && input.length >= minLength && regex.test(input);
    };

    const handleToggleForm = () => {
        setIsLogin(true);
    };
    

    const handleSignup = async (event) => {
        event.preventDefault();
        console.log('Signup clicked');

        // Check if username is valid
        if (!validateUsername(username)) {
            createAlert('Invalid username. Username must be between 5 to 20 characters long and contain only alphanumeric characters and underscores.');
            return;
        }

        // Check if password is valid
        if (!validatePassword(password)) {
            createAlert('Invalid password. Password must be between 5 to 20 characters long and contain only alphanumeric characters and the following symbols: _-!@#$%^&*().')
            return;
        };

        try {
            const response = await fetch(url + '/signup', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.message.includes('successful')){
                    // Move on to application
                    setSignupSuccess(true);
                }
            } else {
                // Signup failed due to an error
                const errorData = await response.json();

                if (errorData.message.includes('duplicate')){
                    if (errorData.message.includes('username')) {
                        createAlert('Username taken, please choose another.');
                    } else if (errorData.message.includes('email')) {
                        createAlert('The email you provided is already associated with an existing account. Please use a different email address or try logging in instead.');
                    }
                } else {
                    console.error("Signup error: ", errorData.message);
                }
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    if (signupSuccess) {
        return <TodoApp />;
    }

    if (isLogin) {
        return <LoginForm />;
    }

    return (
        <div className="auth-form-container py-5">
            
            <img className="pb-4" src={logo} alt="My Logo" /> {/* Display the logo image */}
            <form onSubmit={handleSignup} >
                <div className='mb-3'>
                    {/* <label htmlFor='signupUsername' className='form-label float-start'>
                        Username
                    </label> */}
                    <input
                        type='text'
                        id='signupUsername'
                        className='form-control fw-lighter'
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                        placeholder='Username'
                    />
                </div>

                <div className='mb-3'>
                    {/* <label htmlFor='signupEmail' className='form-label float-start'>
                        Email
                    </label> */}
                    <input
                        type='email'
                        id='signupEmail'
                        className='form-control fw-lighter'
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder='Email address'
                    />
                </div>

                <div className='mb-3'>
                    {/* <label htmlFor='signupPassword' className='form-label float-start'>
                        Password
                    </label> */}
                    <input
                        type='password'
                        id='signupPassword'
                        className='form-control fw-lighter'
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        placeholder='Password'
                    />
                </div>

                <div className='mt-5'>
                    <button type='submit' className='btn btn-primary w-100'>
                        Sign up
                    </button>
                </div>
            </form>
            <div className='mt-2'>
                <button id='switchAuthButton' onClick={handleToggleForm} className='btn btn-link text-dark fw-light'>
                    Have an account? Switch to Login
                </button>
            </div>

            {showAlert && (
                <div className="alert-container">
                    <div className="alert alert-warning alert-dismissible text-break fw-light lh-2" role="alert">
                        {alertMessage}
                        <button type="button" className="btn-close" onClick={destroyAlert} aria-label="Close"></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignupForm;

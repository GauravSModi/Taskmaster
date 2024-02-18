import React, { useState } from 'react';
import TodoApp from '../TodoApp/TodoApp';
import appendAlert from '../Alert/AlertComponent';
import LoginForm from './Login';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

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
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
        alertPlaceholder.innerHTML = '';

        // Check if username is valid
        if (!validateUsername(username)) {
            if (alertPlaceholder != null) {
                appendAlert(alertPlaceholder, 'Invalid username. Username must be between 5 to 20 characters long and contain only alphanumeric characters and underscores.', 'warning');
            }
            return;
        }

        // Check if password is valid
        if (!validatePassword(password)) {
            if (alertPlaceholder != null) {
                appendAlert(alertPlaceholder, 'Invalid password. Password must be between 5 to 20 characters long and contain only alphanumeric characters and the following symbols: _-!@#$%^&*().', 'warning');
            }
            return;
        };

        try {
            const response = await fetch('http://localhost:8009/signup', {
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

                if (errorData.message.includes('duplicate') && alertPlaceholder != null){
                    if (errorData.message.includes('username')) {
                        appendAlert(alertPlaceholder, 'Username taken, please choose another.', 'warning');
                    } else if (errorData.message.includes('email')) {
                        appendAlert(alertPlaceholder, 'The email you provided is already associated with an existing account. Please use a different email address or try logging in instead.', 'warning');
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
        <div>
            <form onSubmit={handleSignup}>
                <div id='liveAlertPlaceholder'></div>
                <div className='mb-3'>
                    <label htmlFor='signupUsername' className='form-label'>
                        Username
                    </label>
                    <input
                        type='text'
                        id='signupUsername'
                        className='form-control'
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                        placeholder='Username'
                    />
                </div>

                <div className='mb-3'>
                    <label htmlFor='signupEmail' className='form-label'>
                        Email
                    </label>
                    <input
                        type='email'
                        id='signupEmail'
                        className='form-control'
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder='Email address'
                    />
                </div>

                <div className='mb-3'>
                    <label htmlFor='signupPassword' className='form-label'>
                        Password
                    </label>
                    <input
                        type='password'
                        id='signupPassword'
                        className='form-control'
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        placeholder='Password'
                    />
                </div>

                <div className='mb-2'>
                    <button type='submit' className='btn btn-primary'>
                        Sign up
                    </button>
                </div>
            </form>
            <div className='mb-2'>
                <button id='switchAuthButton' onClick={handleToggleForm} className='btn btn-secondary'>
                    Switch to Login
                </button>
            </div>
        </div>
    );
};

export default SignupForm;

import React, {useState} from 'react';
import TodoApp from '../TodoApp/TodoApp';
import appendAlert from '../Alert/AlertComponent';
import SignupForm from './Signup';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    const checkEmpty = (user, pass) => {
        return user.length > 0 && pass.length > 0;
    }

    const handleToggleForm = () => {
      setIsSignup(true);
    };

    // // Disable button until fields are populated
    // const [input, setInput] = useState(''); // For input
    // const [isdisabled, setIsDisabled] = useState(false); // For button
    // // When input is changing this function will get called
    // const onChange = (e) => {
    //     setInput((prevState) => (e.target.value));
    //     if(e.target.value.trim().length < 1) {   // Checking the length of the input
    //         setIsDisabled(true);  // Disabling the button if length is < 1
    //     } else {
    //         setIsDisabled(false);
    //     }
    // }

    const handleLogin = async (event) => {
        event.preventDefault();
        console.log("Login clicked");

        const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
        alertPlaceholder.innerHTML = '';

        // Check if username or password fields are empty
        if (!checkEmpty(username, password)) {
            if (alertPlaceholder != null) {
                appendAlert(alertPlaceholder, 'Please fill in both the username and password fields.', 'warning');
            }
            return;
        }
        
        try {
            const response = await fetch('http://localhost:8009/login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();

                const jwtToken = data.token;

                // Move on to application
                setLoginSuccess(true);

            } else {
                // Login failed due to an error
                const errorData = await response.json();

                if (errorData.message.includes('unsuccessful') && alertPlaceholder != null){
                    if (errorData.message.includes('username')) {
                        appendAlert(alertPlaceholder, 'Incorrect username or password. Please try again.', 'warning');
                    } else if (errorData.message.includes('password')) {
                        appendAlert(alertPlaceholder, 'Incorrect username or password. Please try again.', 'warning');
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
        return <TodoApp />;
    }

    if (isSignup) {
        return <SignupForm />;
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <div id='liveAlertPlaceholder'></div>
                <div className='mb-3'>
                    <label htmlFor='loginUsername' className='form-label'>
                        Username
                    </label>
                    <input 
                        type='text'
                        id='loginUsername'
                        className='form-control'
                        value={username} 
                        onChange={event => setUsername(event.target.value)}
                        placeholder='Username'
                        maxLength={20}
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor='loginPassword' className='form-label'>
                        Password
                    </label>
                    <input 
                        type='password'
                        id='loginPassword'
                        className='form-control'
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        placeholder='Password'
                        maxLength={20}
                    />
                </div>
                <div className='mb-2'>
                    <button type='submit' className='btn btn-primary'>Login</button>
                </div>
            </form>

            <div className='mb-2'>
                <button id='switchAuthButton' onClick={handleToggleForm} className='btn btn-secondary'>
                    Switch to Sign Up
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
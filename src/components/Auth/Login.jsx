import React, {useState} from 'react';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = event => {
        event.preventDefault();
        // TODO: Handle login
        console.log('Login clicked');
    };

    return (
        <form onSubmit={handleLogin}>
            <label>
                Username:
                <input type="text" value={username} onChange={event => setUsername(event.target.value)}></input>
            </label>
            <br/>
            <label>
                Password:
                <input type="password" value={password} onChange={event => setPassword(event.target.value)}></input>
            </label>
            <br/>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
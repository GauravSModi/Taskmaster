import React, {useState} from 'react';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = event => {
        event.preventDefault();
        // TODO: Handle Signup
        console.log('Signup clicked');
    };

    return (
        <form onSubmit={handleSignup}>
            <label>
                Email:
                <input type="email" value={email} onChange={event => setEmail(event.target.value)}></input>
            </label>
            <br/>
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
            <button type="submit">Sign up</button>
        </form>
    );
};

export default SignupForm;



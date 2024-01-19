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
            />
        </div>
        <div className='mb-2'>
            <button type='submit' className='btn btn-primary'>Login</button>
        </div>
        </form>
    );
};

export default LoginForm;
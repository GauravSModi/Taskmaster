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
                {/* <small id="passwordHelp" className="form-text text-muted">Min. 6 characters</small> */}
            </div>

            <div className='mb-2'>
                <button type='submit' className='btn btn-primary'>
                    Sign up
                </button>
            </div>
        </form>
    );
};

export default SignupForm;



import React, {useState, useEffect} from 'react';
import './styles/custom.scss';
// import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from './containers/Auth/Login';
import {jwtDecode} from 'jwt-decode';
import Home from './containers/Home/Home';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';


function App() {

    const [loading, setLoading] = useState('true');
    const [signedIn, setSignedIn] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');

        if (!storedToken) {
            setLoading(false);
            return;
        }
    
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
        return <Home token={token}/>;
    }

    return (
        <div className="App w-100 h-100">
            { !loading && <LoginForm /> }
            { loading &&
                <div className="spinner-border spinner-border-lg text-primary" style={{width: '4rem', height: '4rem'}} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div> 
            }

            <SpeedInsights />
        </div>
    );
}

export default App;
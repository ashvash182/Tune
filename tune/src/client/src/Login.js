import React from 'react';
import { Container } from 'react-bootstrap';
//import './App/css';


const CLIENT_ID = '55ab070927814122baceb56cf32982f8'

const AUTH_URL = 'https://accounts.spotify.com/authorize?' +
'client_id=' +
CLIENT_ID + '&' +
'response_type=code&' +
'redirect_uri=http://localhost:3000&' +
'scope=' +
    'streaming ' +
    'user-read-email ' +
    'user-read-private ' +
    'user-library-read ' +
    'user-library-modify ' +
    'user-read-playback-state ' +
    'user-modify-playback-state ' +
    'user-read-currently-playing ' +
    'user-top-read ' +
    'user-follow-read';

export default function Login() {
    return (
        <Container className='d-flex justify-content align-items-center' style={{ minHeight: '100vh' }}>
            <a className='btn btn-success btn-lg' href={ AUTH_URL }>
                ----
            </a>
        </Container>
    )
}
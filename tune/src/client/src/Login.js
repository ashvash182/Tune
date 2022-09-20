import React from 'react';
import { Container } from 'react-bootstrap';
//import './App/css';
//import 'boostrap/dis/bootstrap/css/bootstrap/min/css';

const AUTH_URL = 'https://accounts.spotify.com/authorize?' +
'client_id=f7450a055d644e5c94cab30cafb546c9&' +
'response_type=code&' +
'redirect_uri=http://localhost:3000&' +
'scope=' +
    'streaming%20user-read-email&' +
    '20user-read-private&' +
    '20user-library-read&' +
    '20user-library-modify&' +
    '20user-read-playback-state&' +
    '20user-modify-playback-state';

const CLIENT_ID = 'f7450a055d644e5c94cab30cafb546c9'

export default function Login() {
    return (
        <Container>
            <a className='btn btn-success btn-lg' href={ AUTH_URL }>
                Login With Spotify
            </a>
        </Container>
    )
}
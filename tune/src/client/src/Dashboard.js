import React from 'react';
import useAuth from './Custom Hooks/useAuth'

export default function Dashboard({ code }) {
    const accessToken = useAuth(code);
    return (
        <div>{ accessToken }</div>
    )
}
import React, { useState, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import Google from "./Google";
import { Redirect } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { Card } from 'react-bootstrap';

export default function Login() {
    let history = useHistory();
    const google = Google.getInstance();

    useEffect(() => {
        // Actualiza el título del documento usando la API del navegador
        document.body.style.background = `url(bg.jpg)`;
    });

    function failure(msg: any) {
        console.log("Error:")
        console.log(msg)
    }

    function authorize(auth: any) {
        google.save(auth);

        console.log(auth);
        //history.push('/')
    }

    if (google.isLogedIn()) {
        return (<Redirect to='/'  />);
    } else {
        return (
        <Card >
            <GoogleLogin style={{ minHeight: '100vh' }}
                clientId="878068974718-ufaiivfbb1ngm4o78bqi0d69nlmuq3el.apps.googleusercontent.com"
                buttonText="Login with Google"
                scope="https://www.googleapis.com/auth/spreadsheets.readonly"
                onSuccess={(auth) => { authorize(auth) }}
                onFailure={failure}
                accessType="id_token token offline"
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}

            />
        </Card>

        );
    }
}
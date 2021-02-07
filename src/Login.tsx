import React from 'react';
import { useState } from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import Google from "./Google";
import { Redirect } from 'react-router-dom';
import { Card } from 'react-bootstrap';


export default function Login() {

    const google = Google.getInstance();
    const [logged, setLogged] = useState(google.isLogedIn())


    const failure = (msg: string) => {
        console.log("Error:");
        console.log(msg);
    }

    const authorize = (auth: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
        google.save(auth);
        setLogged(true);
    }


    if (logged) {
        return (<Redirect to='/' />);
    }

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

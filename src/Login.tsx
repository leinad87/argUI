import React, { useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import Google from "./Google";
import { Redirect } from 'react-router-dom';
import { Card } from 'react-bootstrap';

export default class Login extends React.Component {

    google = Google.getInstance();
    state = {
        logged: this.google.isLogedIn()
    }

    failure(msg: any) {
        console.log("Error:")
        console.log(msg)
    }

    authorize(auth: any) {
        this.google.save(auth);

        
        this.setState({logged: true})
    }

    render() {
        if (this.state.logged) {
            return (<Redirect to='/' />);
        } else {
            return (
                <Card >
                    <GoogleLogin style={{ minHeight: '100vh' }}
                        clientId="878068974718-ufaiivfbb1ngm4o78bqi0d69nlmuq3el.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        scope="https://www.googleapis.com/auth/spreadsheets.readonly"
                        onSuccess={(auth) => { this.authorize(auth) }}
                        onFailure={this.failure}
                        accessType="id_token token offline"
                        cookiePolicy={'single_host_origin'}
                        isSignedIn={true}

                    />
                </Card>

            );
        }
    }
}
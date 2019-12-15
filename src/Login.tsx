import React, { useState, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import DenseTable from "./DenseTable";
import Google from "./Google";
import Portfolio from "./Potfolio";
import { PortofilioType } from "./Google"
import { Card, makeStyles, createStyles, Theme, Grid } from "@material-ui/core";
import { Redirect } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }));



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

        history.push('/')
    }

    if (google.isLogedIn()) {
        return (<Redirect to='/'  />);
    } else {
        return (
            <Grid container spacing={3} justify="center" alignItems="center"
                style={{ minHeight: '100vh' }}>
                <Grid item >
                    <Card >
                        <GoogleLogin style={{ minHeight: '100vh' }}
                            clientId="878068974718-ufaiivfbb1ngm4o78bqi0d69nlmuq3el.apps.googleusercontent.com"
                            buttonText="Login with Google"
                            scope="https://www.googleapis.com/auth/spreadsheets.readonly"
                            onSuccess={(auth) => { authorize(auth) }}
                            onFailure={failure}
                            accessType="offline"
                            cookiePolicy={'single_host_origin'}

                        />
                    </Card>
                </Grid>
            </Grid>


        );
    }
}
import React, {useEffect, useRef} from 'react';
import {useState} from 'react';
import Portfolio from './Potfolio';
import Google from './Google';
import {Redirect, Route, Switch} from "react-router-dom";
import {
    Button,
    Navbar,
    NavItem,
    Spinner,
    ProgressBar,
    Alert, Nav,
} from 'react-bootstrap';
import {slide as Menu} from 'react-burger-menu'
import {PortfolioBook} from './Models/PortfolioBook';
import PositionDetails from './PositionDetails';
import {useHistory} from 'react-router-dom';
import Charts from "./Charts/Charts";
import SheetInputForm from "./SheetInputForm";


export default function PrimarySearchAppBar() {

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [data, setData] = useState<PortfolioBook | null>(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false)
    const history = useHistory();
    const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

    const getData = async () => {
        setLoading(true);
        try {
            const data = await Google.getInstance().getPortfolio((p: number) => setProgress(p))
            setData(data);

        } catch (e) {
            setError(e)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            console.log((e as BeforeInstallPromptEvent).platforms); // e.g., ["web", "android", "windows"]
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt.current = e as BeforeInstallPromptEvent;
            // Update UI to notify the user they can add to home screen
        });
    }, []);

    const installA2HS = async () => {
        if (deferredPrompt.current != null) {
            // Show the prompt
            await deferredPrompt.current.prompt();
            // Wait for the user to respond to the prompt
            let choiceResult = await deferredPrompt.current.userChoice;
            if (choiceResult?.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt.current = null;
        }
    }

    const logout = () => {
        Google.getInstance().logout();
        history.push("/")
    }

    const renderContent = () => {
        if (!Google.getInstance().isSheetValid()) {
            return <SheetInputForm/>
        } else if (!data) {
            return (
                <div style={{height: "100vh"}}>
                    <div style={{justifyContent: "center", alignItems: "center", display: "flex"}}>
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>

                    <div className="m-4">
                        <ProgressBar now={progress}/>
                        <Alert>{error}</Alert>
                    </div>
                </div>

            )
        } else {
            return (
                <Switch>
                    <Route path='/charts' children={<Charts data={data}/>}/>
                    <Route path='/position/:symbol' children={<PositionDetails transactionSheet={data.transactions}/>}/>
                    <Route path='/' children={<Portfolio data={data.portfolio}/>}/>
                </Switch>
            );
        }
    }


    if (!Google.getInstance().isLogedIn()) {
        return <Redirect to='/login'/>;
    }

    return (
        <>
            <Navbar bg="dark" sticky="top" variant="dark">
                <span className="hamburger" onClick={() => setMenuOpen(!isMenuOpen)}/>
                <NavItem className="navbar-brand">argÜI</NavItem>
                <Navbar.Collapse className="justify-content-end">
                    {!isLoading ? <Nav.Link onClick={() => getData()}>Refresh</Nav.Link> :
                        <Spinner animation="border" role="status"/>}
                    <Nav.Link onClick={() => history.push("/charts")}>Charts</Nav.Link>
                </Navbar.Collapse>
            </Navbar>
            <div className="wrapper">
                <Menu customBurgerIcon={false} customCrossIcon={false} isOpen={isMenuOpen}
                      onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)}>
                    <Button variant="link" onClick={() => history.push("/")}>Home</Button>
                    {deferredPrompt.current ?
                        <Button variant="link" onClick={() => installA2HS()}>Install</Button> : ""}
                    <Button variant="link" onClick={() => logout()}>Logout</Button>
                </Menu>
                <div className="p-2">
                    {renderContent()}
                </div>
            </div>
        </>
    )

}

import React, { useEffect } from 'react';
import { useState } from 'react';
import Portfolio from './Potfolio';
import Google from './Google';
import { Redirect, Route, Switch } from "react-router-dom";
import {
    Button,
    Navbar,
    NavItem,
    Spinner,
    ProgressBar,
    Col,
    Row,
    Container,
    Alert, Nav,
} from 'react-bootstrap';
import { slide as Menu } from 'react-burger-menu'
import { PortfolioBook } from './Models/PortfolioBook';
import PositionDetails from './PositionDetails';
import { useHistory } from 'react-router-dom';
import Charts from "./Charts/Charts";
import SheetInputForm from "./SheetInputForm";


export default function PrimarySearchAppBar() {

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [data, setData] = useState<PortfolioBook | null>(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const history = useHistory();

    useEffect(() => {
        Google.getInstance().getPortfolio((p: number) => setProgress(p))
            .then((d) => setData(d))
            .catch((e) => setError(e));
    }, []);

    let deferredPrompt: BeforeInstallPromptEvent | null;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e as BeforeInstallPromptEvent;
        // Update UI to notify the user they can add to home screen
    });

    const installA2HS = async () => {
        if (deferredPrompt != null) {
            // Show the prompt
            await deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            let choiceResult = await deferredPrompt.userChoice;
            if (choiceResult?.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        }
    }

  const renderContent = () => {
    if (!Google.getInstance().isSheetValid()) {
      return <SheetInputForm />
    } else if (!data) {
      return (
        <Container className="show-grid">
          <Row className="mt-5 Zmb-2">
            <Col style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
          <Row>
            <Col>
              <ProgressBar now={progress} /></Col>
          </Row>
          <Row>
            <Alert>{error}</Alert>
          </Row>
        </Container>
      )
    } else {
      return (
        <Switch>
          <Route path='/charts' children={ <Charts data={data} />} />
          <Route path='/position/:symbol' children={<PositionDetails transactionSheet={data.transactions} />} />
          <Route path='/' children={<Portfolio data={data.portfolio}  />} />
        </Switch>
      );
    }
  }


  if (!Google.getInstance().isLogedIn()) {
    return <Redirect to='/login' />;
  }

  return (
    <>
      <Navbar bg="dark" sticky="top" variant="dark">
        <span className="hamburger" onClick={() => setMenuOpen(!isMenuOpen)} />
        <NavItem className="navbar-brand">argUI</NavItem>
          <Navbar.Collapse className="justify-content-end">
              <Nav.Link onClick={()=>history.push("/charts")}>Charts</Nav.Link>
          </Navbar.Collapse>
      </Navbar>
      <div className="wrapper">
        <Menu customBurgerIcon={false} customCrossIcon={false} isOpen={isMenuOpen} onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)}>
          <a id="home" className="menu-item" href="/">Home</a>
            <Button onClick={()=>installA2HS()}>Install</Button>
            <a id="logout" className="menu-item" href="#" onClick={()=>{
                Google.getInstance().logout();
                history.push("/")
            }}>Logout</a>
        </Menu>
        <div className="mb-5">
          {renderContent()}
        </div>
      </div>
    </>
  )

}

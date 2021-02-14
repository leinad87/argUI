import React, { useEffect } from 'react';
import { useState } from 'react';
import Portfolio from './Potfolio';
import Google from './Google';
import { Redirect, Route, Switch } from "react-router-dom";
import {
    Form,
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


export default function PrimarySearchAppBar() {

  const [sheetID, setSheetID] = useState('');
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

  const renderContent = () => {
    if (!Google.getInstance().isSheetValid()) {
      return (
        <Form>
          <Form.Group controlId="sheet-id">
            <Form.Label>Sheet ID. Puedes sacarla de la URL</Form.Label>
            <Form.Control placeholder="Sheet ID" value={sheetID} onChange={e => setSheetID(e.target.value)} />
            <Form.Text className="text-muted">
              No nos importa tu cartera, no la veremos nunca.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={() => Google.getInstance().sheetId = sheetID}>
            Submit
          </Button>

        </Form>

      )
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
        </Menu>
        <div className="mb-5">
          {renderContent()}
        </div>
      </div>
    </>
  )

}

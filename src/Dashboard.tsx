import React from 'react';
import { useState } from 'react';
import Portfolio from './Potfolio';
import Google from './Google';
import { Redirect, Route, Switch } from "react-router-dom";
import { Form, Button, Navbar, NavItem, Spinner, ProgressBar, Col, Row, Container } from 'react-bootstrap';
import { slide as Menu } from 'react-burger-menu'
import { PortfolioBook } from './Models/PortfolioBook';

export default function PrimarySearchAppBar() {

  const [sheetID, setSheetID] = useState('');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<PortfolioBook | null>(null);
  const [progress, setProgress] = useState(0);

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

      Google.getInstance().getPortfolio((p: number) => setProgress(p)).then((d) => setData(d));
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
        </Container>
      )
    } else {
      return (
        <Switch>
          <Route path='/charts'>
          </Route>
          <Route path='/'>

            <Portfolio data={data.portfolio} historic={data.historic} />

          </Route>
        </Switch>

      );
    }
  }


  if (!Google.getInstance().isLogedIn()) {
    return <Redirect to='/login' />;
  }

  return (
    <div>
      <Navbar bg="dark" sticky="top" variant="dark">
        <span className="hamburger" onClick={() => setMenuOpen(!isMenuOpen)}></span>
        <NavItem className="navbar-brand">argUI</NavItem>
      </Navbar>
      <div className="wrapper">
        <Menu customBurgerIcon={false} customCrossIcon={false} isOpen={isMenuOpen} onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)}>
          <a id="home" className="menu-item" href="/">Home</a>
          <a id="about" className="menu-item" href="/about">About</a>
          <a id="contact" className="menu-item" href="/contact">Contact</a>
        </Menu>
        <div className="mb-5">
          {renderContent()}
        </div>
      </div>
    </div>
  )

}

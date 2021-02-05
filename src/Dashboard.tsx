import React from 'react';
import {useState} from 'react';
import Portfolio from './Potfolio';
import Google from './Google';
import { Redirect } from "react-router-dom";
import { Form, Button, Navbar, NavItem } from 'react-bootstrap';
import { slide as Menu } from 'react-burger-menu'

export default function PrimarySearchAppBar(){

  const [ sheetID, setSheetID] = useState('')
  const [ isMenuOpen, setMenuOpen] = useState(false)

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
          <Button variant="primary" type="submit" onClick={() => {
            Google.getInstance().setSheetID(sheetID);
            //history.push('/');
          }}>
            Submit
  </Button>

        </Form>

      )
    } else {
      return (<Portfolio />);
    }
  }

  
    if (!Google.getInstance().isLogedIn()) {
      return (<Redirect to='/login' />);
    }

    return (
      <div> 
        <Navbar bg="dark" sticky="top" variant="dark">
          <span className="hamburger" onClick={()=>setMenuOpen(!isMenuOpen)}></span>
          <NavItem className="navbar-brand">argUI</NavItem>
        </Navbar>
        <div className="wrapper">
        <Menu customBurgerIcon={ false } customCrossIcon={ false } isOpen={ isMenuOpen } onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)}>
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

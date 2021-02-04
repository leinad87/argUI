
import Portfolio from './Potfolio';
import Google from './Google';
import { Redirect } from "react-router-dom";
import { Form, Button, Navbar, Container, NavItem } from 'react-bootstrap';

export default class PrimarySearchAppBar extends React.Component {

  state = {
    sheetID: '',
  }

  renderContent = () => {

    if (!Google.getInstance().isSheetValid()) {
      return (
        <Form>
          <Form.Group controlId="sheet-id">
            <Form.Label>Sheet ID. Puedes sacarla de la URL</Form.Label>
            <Form.Control placeholder="Sheet ID" value={this.state.sheetID} onChange={e => this.setState({ sheetID: e.target.value })} />
            <Form.Text className="text-muted">
              No nos importa tu cartera, no la veremos nunca.
    </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={() => {
            Google.getInstance().setSheetID(this.state.sheetID);
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



  render() {
    if (!Google.getInstance().isLogedIn()) {
      return (<Redirect to='/login' />);
    }

    return (
      <div>
        <Navbar bg="dark" sticky="top" variant="dark">
          <NavItem className="navbar-brand">argUI: {Google.getInstance().setSheetID}</NavItem>
        </Navbar>
        <Container>
          {this.renderContent()}
        </Container>
      </div>)
  }
}

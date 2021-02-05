import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Card, Container, Row, Col, Spinner} from 'react-bootstrap';
import PortfolioItem from './PortfolioItem'

import CSS from 'csstype';
import Google from './Google';

const h1Styles: CSS.Properties = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  float: "left",
  clear: "left",/* stack those two */
  fontSize: "2.5em",
  marginRight: "0.2em"
};

const h2Styles: CSS.Properties = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  paddingTop: '14px',
  fontSize: "0.8em",

};

const h3Styles: CSS.Properties = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  fontSize: "0.8em",
  marginTop: "-2px",
};

const subheader: CSS.Properties = {
  borderTop: '1px solid gray',
};

const cardColorRed: CSS.Properties = {
  borderLeft: "5px solid red"
}

const cardColorGreen: CSS.Properties = {
  borderLeft: "5px solid green"
}

export default class Portfolio extends React.Component {
  state = {
    data: { positions: [], change: 0, profit: 0, currentValue: 0, totalInvestment: 0 },
    value: 0,
  }

  border_class(profit: number) {
    return profit < 0 ? cardColorRed : cardColorGreen;
  }


  summary() {
    if (this.state.data.positions.length === 0) return
    return (
      <Row>
        <Col>
        <Card className="p-0" style={this.border_class(this.state.data.change)}>
          <Card.Body className="p-0">
            <div >
              <h5>Total gain</h5>
              <div>
                <div style={h1Styles} className="m-0">{Math.floor(this.state.data.profit).toLocaleString()}</div>
                <div style={h2Styles}>{((this.state.data.profit % 1) * 100).toFixed(0)}</div>
                <div style={h3Styles}>EUR</div>
              </div>

            </div>
          </Card.Body>
          <Card.Footer className="bt-0 p-0">
              <Row>
                <Col>
                  <div style={subheader}>
                    <h6 className="m-0">Change</h6>
                    <span>{this.state.data.change < 0 ? "" : "+"}{this.state.data.change}</span>
                  </div>
                </Col>

                <Col>
                  <div style={subheader}>
                    <h6 className="m-0">Value</h6>
                    <div>{this.state.data.currentValue < 0 ? "" : "+"}{this.state.data.currentValue}</div>
                  </div>
                </Col>
                <Col>
                  <div style={subheader}>
                    <h6 className="m-0">Cost</h6>
                    <div>{this.state.data.totalInvestment < 0 ? "" : "+"}{this.state.data.totalInvestment}</div>
                  </div>
                </Col>
              </Row>
          </Card.Footer>

        </Card></Col>
      </Row>
    )
  }

  render() {
    if (!this.state.data || this.state?.data?.positions?.length === 0) {
      Google.getInstance().getPortfolio().then((d) => this.setState({ data: d }));
      return (
        <div style={{justifyContent: "center", alignItems: "center", height: "100%",display: "flex" }}>
        <Spinner animation="border"  role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        </div>
      )
    } else {
      return (
        <div style={{ padding: '0px' }}>

          <Switch>
            <Route path='/charts'>
            </Route>
            <Route path='/'>

              <Container className="px-1 pt-1">
                {this.summary()}
                {/*this.state.data!.positions?.map((p: any) => this.position(p))*/}
                {this.state.data!.positions.map((p: any) => <PortfolioItem position={p} />)}

              </Container>

            </Route>
          </Switch>

        </div >
      )
    }
  }
}
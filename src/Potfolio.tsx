import React from 'react';

import { Card, Container, Row, Col } from 'react-bootstrap';
import PortfolioItem from './PortfolioItem'

import CSS from 'csstype';

import PortfolioSheet from './Models/PortfolioSheet';
import { PositionType } from "./Models/PortfolioSheet";

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

type PortfolioProps = {
  data: PortfolioSheet
}

const Portfolio = ({ data }: PortfolioProps) => {


  function border_class(profit: number) {
    return profit < 0 ? cardColorRed : cardColorGreen;
  }


  function summary() {
    if (data === undefined) return;

    else
      return (
        <Row>
          <Col>
            <Card className="p-0" style={border_class(data!.change)}>
              <Card.Body className="p-0">
                <Row>
                  <Col sm={3} xs={5}>
                    <h5>Total gain</h5>
                    <div>
                      <div style={h1Styles} className="m-0">{Math.floor(data!.profit).toLocaleString()}</div>
                      <div style={h2Styles}>{((data!.profit % 1) * 100).toFixed(0)}</div>
                      <div style={h3Styles}>EUR</div>
                    </div>
                  </Col>
                  <Col sm={9} xs={7}>

                  </Col>
                </Row>


              </Card.Body>
              <Card.Footer className="bt-0 p-0">
                <Row>
                  <Col>
                    <div style={subheader}>
                      <h6 className="m-0">Change</h6>
                      <span>{data!.change < 0 ? "" : "+"}{data!.change}</span>
                    </div>
                  </Col>

                  <Col>
                    <div style={subheader}>
                      <h6 className="m-0">Value</h6>
                      <div>{data!.currentValue < 0 ? "" : "+"}{data!.currentValue}</div>
                    </div>
                  </Col>
                  <Col>
                    <div style={subheader}>
                      <h6 className="m-0">Cost</h6>
                      <div>{data!.totalInvestment < 0 ? "" : "+"}{data!.totalInvestment}</div>
                    </div>
                  </Col>
                </Row>
              </Card.Footer>
            </Card></Col>
        </Row>
      )
  }

  return (
    <Container className="px-1 pt-1">
      {summary()}
      {data!.positions.map((p: PositionType) => <PortfolioItem position={p} />)}
    </Container>
  )
}

export default Portfolio;

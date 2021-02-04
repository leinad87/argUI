import React, { Component } from "react";
import './PortfolioItem.css'
import { Card, Container, Row, Col, } from 'react-bootstrap';
import CSS from 'csstype';
import { PositionType } from "./Google";

const title: CSS.Properties = {
  fontFamily: "roboto-regular",
}
const name: CSS.Properties = {
  fontFamily: "roboto-regular",
}

const a: CSS.Properties = {
  border: "1px solid red",
  float: "left",
  clear: "left",
}
const cardColorRed: CSS.Properties = {
  borderLeft: "5px solid red",
  marginTop: "6px",
}

const cardColorGreen: CSS.Properties = {
  borderLeft: "5px solid green",
  marginTop: "6px",
}

function border_class(profit: number) {
  return profit < 0 ? cardColorRed : cardColorGreen;
}

function PortfolioItem(props: any) {

  const position:PositionType = props.position;
  const change = position.current_price-position.current_price/(position.chg_today/100+1);
  return (
    <Card style={border_class(change)}>
      <Container>
        <Row>
          <Col><span >{position.ticker}</span>
            <div >{position.name}</div>
          </Col>
          <Col>
            <span >{position.value} €  </span>
            <span >{change>=0?"▲":"▼"}{change.toFixed(2)} ({position.chg_today.toFixed(2)}%)</span>
          </Col>
        </Row>
      </Container>

    </Card>
  );
}


export default PortfolioItem;

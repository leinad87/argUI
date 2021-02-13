import React from "react";
import './PortfolioItem.css'
import { Card, Row, Col, } from 'react-bootstrap';
import CSS from 'csstype';
import { PositionType } from "./Models/PortfolioSheet";
import { useHistory } from "react-router-dom";

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

type PortfolioItemProps = {
  position: PositionType
}

const PortfolioItem = ({ position }: PortfolioItemProps) => {
  let history = useHistory();

  const change = position.current_price - position.current_price / (position.chg_today / 100 + 1);

  return (
    <Card style={border_class(change)} className="px-1" onClick={() => history.push(`/position/${position.ticker}`)}>
      <Row>
        <Col xs={8}>
          <span style={{ float: "left" }} className={"limitText w-100"}>{position.name}</span>
        </Col>
        <Col xs={4}>
          <span style={{ float: "right" }}>{position.value} €  </span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span style={{ float: "left" }}></span>
        </Col>
        <Col>
          <span style={{ float: "right", color: change > 0 ? "green" : "red" }} >{change >= 0 ? "▲" : "▼"}{change.toFixed(2)} ({position.chg_today.toFixed(2)}%)</span>
        </Col>
      </Row>
    </Card>
  );
}

export default PortfolioItem;

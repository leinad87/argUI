import React from "react";
import './PortfolioItem.css'
import { Row, Col, } from 'react-bootstrap';
import CSS from 'csstype';
import { PositionType } from "./Models/PortfolioSheet";
import { useHistory } from "react-router-dom";

const cardColorRed: CSS.Properties = {
  borderLeft: "2px solid red",
}

const cardColorGreen: CSS.Properties = {
  borderLeft: "2px solid green",
}

function border_class(profit: number) {
  return profit < 0 ? cardColorRed : cardColorGreen;
}

type PortfolioItemProps = {
  position: PositionType,
  isFirst?: boolean
  isLast?: boolean
}

const PortfolioItem = ({ position, isFirst=false, isLast=false }: PortfolioItemProps) => {
  let history = useHistory();

  const change = position.current_price - position.current_price / (position.chg_today / 100 + 1);

  const rounded = isLast? "rounded-bottom": isFirst?"rounded-top":"";
  const profit = position.cost-position.value;
  const performance = 100*profit/position.cost;
  return (
  <li  style={border_class(change)} className={`${rounded} p-1 list-group-item list-group-item-action flex-column align-items-start`}
         onClick={() => history.push(`/position/${position.ticker}`)}
  >
      <Row >
        <Col xs={8}>
          <span style={{ float: "left" }} className={"limitText w-100"}>{position.name}</span>
        </Col>
        <Col xs={4}>
          <span style={{ float: "right" }}>{position.value} €  </span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span style={{ float: "left", color: change > 0 ? "green" : "red" }} >{change > 0 ? "▲" : change < 0 ? "▼" : ""}{change.toFixed(3)} ({position.chg_today.toFixed(2)}%)</span>
        </Col>
        <Col>
          <span style={{ float: "right" }}>{profit.toFixed(2)}€ ({performance.toFixed(2)}%)</span>
        </Col>
      </Row>
  </li>
  );
}

export default PortfolioItem;

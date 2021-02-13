import { useParams } from "react-router-dom";
import { TransactionRow, TransactionSheet } from "./Models/TransactionSheet";

import dividendImg from "./images/dividendo.png"
import moment from "moment";
import {useContext, useEffect} from "react";
import {AppContext} from "./AppContext";

type PositionDetailsProps = {
    transactionSheet: TransactionSheet;
}



const item = (i: TransactionRow, extraClass: string) => {
    return (
        <a href="#" className={`${extraClass} list-group-item list-group-item-action flex-column align-items-start`}>
            <div className="d-flex">
                <img className="align-self-center mr-3" src={dividendImg} alt="Generic placeholder image"/>
                <p>{i.operation_type}</p>
                <p>Shares: {i.count}</p>
                <p>Date: {moment(i.date).calendar()}</p>
                <p>Tax: {i.tax}</p>
                <p>Total: {i.total}</p>
            </div>
        </a>
    )
}

const PositionDetails = ({ transactionSheet }: PositionDetailsProps) => {
    const { state,dispatch } = useContext(AppContext);

    let { symbol } = useParams();
    let transactions = transactionSheet.row.filter(i => i.symbol === symbol)

    useEffect(() => {
        dispatch({ type: "ADD_ARTICLE", payload:{ theme: symbol } });
    }, []);


    return (
        <div>
            <h3>{symbol}</h3>
            <ul className="m-0 p-1">
                {item(transactions[0], "rounded-top")}
                {transactions.slice(1, -1).map((i: TransactionRow) => item(i, ""))}
                {item(transactions[transactions.length - 1], "rounded-bottom")}
            </ul>
        </div>
    )
}

export default PositionDetails;
import { useParams } from "react-router-dom";
import { TransactionRow, TransactionSheet } from "./Models/TransactionSheet";

import dividendImg from "./images/dividendo.png"
import check from "./images/cheque-bancario.png"

import moment from "moment";

type PositionDetailsProps = {
    transactionSheet: TransactionSheet;
}

const item = (i: TransactionRow, extraClass: string) => {
    return (
        <li className={`${extraClass} list-group-item list-group-item-action flex-column align-items-start`}>
            <div className="d-flex">
                <img className="align-self-center mr-3" src={i.operation_type == "Dividendo"?dividendImg:check} alt="Generic placeholder"/>
                <p>{i.operation_type}</p>
                <p>Shares: {i.count}</p>
                <p>Date: {moment(i.date).calendar()}</p>
                <p>Tax: {i.tax}</p>
                <p>Total: {i.total}</p>
            </div>
        </li>
    )
}

const PositionDetails = ({ transactionSheet }: PositionDetailsProps) => {

    let { symbol } = useParams();
    let transactions = transactionSheet.row.filter(i => i.symbol === symbol)

    return (
        <div>
            <h3>{symbol}</h3>
            <ul className="m-0 p-0">
                {item(transactions[0], "rounded-top")}
                {transactions.slice(1, -1).map((i: TransactionRow) => item(i, ""))}
                {item(transactions[transactions.length - 1], "rounded-bottom")}
            </ul>
        </div>
    )
}

export default PositionDetails;
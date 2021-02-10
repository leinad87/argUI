import { HistoricSheet } from "./HistoricSheet";
import PortfolioSheet from "./PortfolioSheet";
import { TransactionSheet } from "./TransactionSheet";

export class PortfolioBook {
    historic: HistoricSheet;
    portfolio: PortfolioSheet;
    transactions: TransactionSheet;

    constructor(portfolioSheet: PortfolioSheet, historicSheet: HistoricSheet, transactions: TransactionSheet) {
        this.portfolio = portfolioSheet;
        this.historic = historicSheet;
        this.transactions = transactions;

    }
};

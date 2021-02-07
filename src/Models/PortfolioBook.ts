import { HistoricSheet } from "./HistoricSheet";
import PortfolioSheet from "./PortfolioSheet";

export class PortfolioBook {
    historic: HistoricSheet;
    portfolio: PortfolioSheet;

    constructor(portfolioSheet: PortfolioSheet, historicSheet: HistoricSheet) {
        this.portfolio = portfolioSheet;
        this.historic = historicSheet;
    }
};

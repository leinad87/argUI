
export type PositionType = {
    name: string,
    ticker: string,
    count: string,
    avg_price: string,
    current_price: number,
    chg_today: number,
    cost: string,
    value: string,
    profit: number,
    profitability: string,
    profitability_w_dividends: string,
    ytd: string,
    div_ytd: string,
    div_total: string,
    div_year: string,
    yoc: string,
    weight: string,
}

export default class PortfolioSheet {
    positions: Array<PositionType>;
    totalInvestment: number;
    currentValue: number;
    change: number;
    profit: number;

    constructor(investment: number, value: number, profit: number) {
        this.positions = [];
        this.change = 0;
        this.totalInvestment = investment;
        this.currentValue = value;
        this.profit = profit;
    }

}
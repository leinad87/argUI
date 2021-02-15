
export type PositionType = {
    name: string,
    ticker: string,
    count: number,
    avg_price: number,
    current_price: number,
    chg_today: number,
    cost: number,
    value: number,
    profit: number,
    profitability: string,
    profitability_w_dividends: number,
    ytd: string,
    div_ytd: number,
    div_total: number,
    div_year: number,
    yoc: number,
    weight: number,
    industry: string,
    supersector: string,
    sector: string,
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
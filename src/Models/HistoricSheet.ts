
export class HistoricSheet {
    row: HistoricRow[]

    constructor() {
        this.row = []
    }

    pushRow(data: HistoricRow) {
        this.row.push(data)
    }
}

export class HistoricRow {
    date: Date;
    input: number;
    value: number;
    profit: number;

    constructor(date: Date, input: number, value: number, profit: number) {
        this.date = date;
        this.input = input;
        this.value = value;
        this.profit = profit;
    }
}
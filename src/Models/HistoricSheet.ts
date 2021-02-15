
export class HistoricSheet {
    row: HistoricRow[]

    constructor() {
        this.row = []
    }

    pushRow(data: HistoricRow) {
        if(this.row.length > 0 && this.row[this.row.length-1].date.getTime() === data.date.getTime()){
            this.row[this.row.length-1] = data;
        }else {
            this.row.push(data)
        }
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
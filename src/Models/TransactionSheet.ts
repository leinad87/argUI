
export class TransactionSheet {
    row: TransactionRow[]

    constructor() {
        this.row = []
    }

    pushRow(data: TransactionRow) {
        this.row.push(data)
    }
}

export class TransactionRow {
    instrument_type: string;
    operation_type: string;
    date: Date;
    symbol: string;
    country: string;
    count: number;
    price: number;
    tax: number;
    total: number;
    forex_conversion: number;
    total_local: number;
    state: string;

    constructor(instrument_type: string, operation_type: string, date: Date, symbol: string, country: string,
        count: number, price: number, tax: number, total: number, forex_conversion: number, total_local: number,
        state: string) {
        this.date = date;
        this.instrument_type = instrument_type;
        this.operation_type = operation_type;
        this.symbol = symbol;
        this.country = country;
        this.count = count;
        this.price = price;
        this.tax = tax;
        this.total = total;
        this.forex_conversion = forex_conversion;
        this.total_local = total_local;
        this.state = state;
    }
}
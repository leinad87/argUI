import axios from 'axios';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import Cookies from 'universal-cookie';
import { HistoricRow, HistoricSheet } from './Models/HistoricSheet';
import { PortfolioBook } from './Models/PortfolioBook';
import PortfolioSheet from './Models/PortfolioSheet';
import { TransactionRow, TransactionSheet } from './Models/TransactionSheet';

class Google {
    _sheetId: string;
    token: string;
    name: string;
    picture_url: string;
    expires_at: number;

    constructor() {
        const cookies = new Cookies();

        this.token = cookies.get('token') || '';
        this.name = cookies.get('name');
        this.picture_url = cookies.get('picture');
        this._sheetId = cookies.get('sheet') || '';
        this.expires_at = cookies.get('expires_at');
    }

    static _instance: Google;
    static getInstance(): Google {
        if (this._instance == null) {
            this._instance = new Google();
        }
        return this._instance;
    }

    save(auth: any) { //GoogleLoginResponse | GoogleLoginResponseOffline
        const decoded: any = jwt.decode(auth.tokenId);
        new Cookies().set('token', auth.accessToken, { path: '/' });
        new Cookies().set('name', decoded.name, { path: '/' });
        new Cookies().set('picture', decoded.picture, { path: '/' });
        new Cookies().set('expires_at', decoded.exp, { path: '/' });

        Google._instance = new Google();
    }

    isLogedIn(): boolean {
        return (this.token?.length > 0) && (this.expires_at * 1000 > Date.now());
    }

    logout() {
        new Cookies().remove('token');
        new Cookies().remove('name');
        new Cookies().remove('picture');
        new Cookies().remove('expires_at');

        Google._instance = new Google();
    }

    isSheetValid(): boolean {
        return this._sheetId?.length > 0;
    }

    set sheetId(id: string) {
        this._sheetId = id;
        new Cookies().set('sheet', id, { path: '/' });
    }

    async getPortfolio(reportProgress: (p: number) => void) {

        try {
            let url = `https://sheets.googleapis.com/v4/spreadsheets/${this._sheetId}/values/Cartera!A:W`;
            let response = await axios.get(url, this.headers());
            const portfolio = this.parsePortfolioSheet(response.data.values);
            reportProgress(33);
            //await new Promise(r => setTimeout(r, 1000));
            url = `https://sheets.googleapis.com/v4/spreadsheets/${this._sheetId}/values/Histórico!A:T`;
            response = await axios.get(encodeURI(url), this.headers());
            const historic = this.parseHistoricSheet(response.data.values);
            reportProgress(66);
            //await new Promise(r => setTimeout(r, 1000));
            url = `https://sheets.googleapis.com/v4/spreadsheets/${this._sheetId}/values/Operaciones!A:O`;
            response = await axios.get(encodeURI(url), this.headers());
            const transactionSheet = this.parseTransactionSheet(response.data.values);
            reportProgress(100);

            return new PortfolioBook(portfolio, historic, transactionSheet);

        } catch (e) {
            this.disconnect();
            console.log(e);
            return null;
        }
    }
    disconnect() {
        this.token = '';
        this.name = '';
        this.picture_url = '';
        this.expires_at = 0;
        new Cookies().remove('token');
        new Cookies().remove('name');
        new Cookies().remove('picture');
        new Cookies().remove('expires_at');
    }

    // Aux methods
    headers = () => {
        return {
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        }
    }

    parseMoneyFormat = (text: string) => {
        return parseFloat(text.replaceAll(".", "").replace(",", "."))
    }

    parsePortfolioSheet(data: any[][]) {

        var result = new PortfolioSheet(
            this.parseMoneyFormat(data[4][2]),
            this.parseMoneyFormat(data[5][2]),
            this.parseMoneyFormat(data[7][2])
        )

        var row = 12;
        while (data[row].length > 0 && data[row][2] !== '') {
            result.positions.push({
                name: data[row][1],
                ticker: data[row][2],
                count: data[row][3],
                avg_price: data[row][5],
                current_price: parseFloat(data[row][6]),
                chg_today: parseFloat(data[row][7].replace('.', '').replace(',', '.')),
                cost: data[row][9],
                value: data[row][10],
                profit: Number(data[row][11].replace('.', '').replace(',', '.')),
                profitability: data[row][13],
                profitability_w_dividends: data[row][14],
                ytd: data[row][16],
                div_ytd: data[row][17],
                div_total: data[row][18],
                div_year: data[row][19],
                yoc: data[row][21],
                weight: data[row][22],
            });
            row++;
        }

        result.change = data.filter((row: any[]) => row[1] === "TOTAL")?.[0][6];

        return result;
    }

    parseHistoricSheet(data: any[][]): HistoricSheet {

        let result = new HistoricSheet();

        var row_i = 0;
        while (data[row_i]?.length > 0 && data[row_i][0] !== '') {
            const row = data[row_i];
            const date = moment(row[0], "DD/MM/YYYY").toDate()
            const input = this.parseMoneyFormat(row[1]);
            const value = this.parseMoneyFormat(row[2]);
            const profit = this.parseMoneyFormat(row[4]);


            result.pushRow(new HistoricRow(date, input, value, profit));

            row_i++;
        }

        return result;
    }

    parseTransactionSheet(data: any[][]): TransactionSheet {
        let result = new TransactionSheet();

        let cols = new Map<string, number>(data[0].map((obj: string, idx: number) => [obj, idx]));

        data.slice(1).filter((i: any) => i?.length > 0 && i[0] !== '')
            .map((row: any) => {

                let trimmedRow = row.map((col: string) => col.trim());

                return new TransactionRow(
                    trimmedRow[cols.get('Tipo')!],
                    trimmedRow[cols.get('Operación')!],
                    moment(trimmedRow[cols.get('Fecha')!], "DD/MM/YYYY").toDate(),
                    trimmedRow[cols.get('Ticker')!],
                    trimmedRow[cols.get('País')!],
                    parseInt(trimmedRow[cols.get('Acciones')!]),
                    this.parseMoneyFormat(trimmedRow[cols.get('Precio')!]),
                    this.parseMoneyFormat(trimmedRow[cols.get('Comisión')!]),
                    this.parseMoneyFormat(trimmedRow[cols.get('Total divisa')!]),
                    this.parseMoneyFormat(trimmedRow[cols.get('Tipo')!]),
                    this.parseMoneyFormat(trimmedRow[cols.get('Total Local')!]),
                    trimmedRow[cols.get('Estado')!])
            }).forEach((i: TransactionRow) => result.pushRow(i))

        return result;

    }
}

export default Google;
import axios from 'axios';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import Cookies from 'universal-cookie';
import { HistoricRow, HistoricSheet } from './Models/HistoricSheet';
import { PortfolioBook } from './Models/PortfolioBook';
import PortfolioSheet from './Models/PortfolioSheet';
import { TransactionRow, TransactionSheet } from './Models/TransactionSheet';
import _ from "lodash";

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
        if (Google._instance == null) {
            Google._instance = new Google();
        }
        return Google._instance;
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
        new Cookies().remove('sheet');

        Google._instance = new Google();
    }

    isSheetValid(): boolean {
        return this._sheetId?.length > 0;
    }

    set sheetId(id: string) {
        this._sheetId = id;
        new Cookies().set('sheet', id, { path: '/' });
    }

    query = async (range: string) => {
        let url = `https://sheets.googleapis.com/v4/spreadsheets/${this._sheetId}/values/${range}`;
        let response = await axios.get(url, this.headers());
        return response.data.values;
    }

    async getPortfolio(reportProgress: (p: number) => void) {

        if(!this.isSheetValid())
            return null;

        try {

            const portfolioResponse = await this.query("Cartera!A:W")
            reportProgress(20);

            let dataSheet = this.parseDataSheet(await this.query("Datos!A:H"));
            reportProgress(40);

            const portfolio = this.parsePortfolioSheet(portfolioResponse, dataSheet);
            reportProgress(60);

            const historic = this.parseHistoricSheet(await this.query("Histórico!A:T"));
            reportProgress(80);

            const transactionSheet = this.parseTransactionSheet(await this.query("Operaciones!A:O"));
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

    parsePortfolioSheet(data: any[][], dataSheet: any[]) {

        var result = new PortfolioSheet(
            this.parseMoneyFormat(data[4][2]),
            this.parseMoneyFormat(data[5][2]),
            this.parseMoneyFormat(data[7][2])
        )

        var row = 12;
        while (data[row].length > 0 && data[row][2] !== '') {
            const symbol = data[row][2].trim();
            const metadata = _.find(dataSheet, {'symbol': symbol});

            result.positions.push({
                name: data[row][1],
                ticker: symbol,
                count: data[row][3],
                avg_price: this.parseMoneyFormat(data[row][5]),
                current_price: parseFloat(data[row][6]),
                chg_today: parseFloat(data[row][7].replace('.', '').replace(',', '.')),
                cost: this.parseMoneyFormat(data[row][9]),
                value: this.parseMoneyFormat(data[row][10]),
                profit: Number(data[row][11].replace('.', '').replace(',', '.')),
                profitability: data[row][13],
                profitability_w_dividends: data[row][14],
                ytd: data[row][16],
                div_ytd: this.parseMoneyFormat(data[row][17]),
                div_total: this.parseMoneyFormat(data[row][18]),
                div_year: this.parseMoneyFormat(data[row][19]),
                yoc: data[row][21],
                weight: data[row][22],
                sector: metadata?.sector.trim(),
                supersector: metadata?.supersector.trim(),
                industry: metadata?.industry.trim()
            });
            row++;
        }

        result.change = this.parseMoneyFormat(data.filter((row: any[]) => row[1] === "TOTAL")?.[0][6]);

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

    parseDataSheet(data: string[][]) {
        return data.slice(3) // remove headers
            .filter(row=>row?.[0]) // ignore empty rows
            .map(row=> {
                return {
                    symbol: row[0],
                    supersector: row[1],
                    sector: row[2],
                    industry: row[3]
                }
            })
    }
}

export default Google;
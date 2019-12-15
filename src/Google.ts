import axios from 'axios';
import Portfolio from './Potfolio';
import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';

export type PositionType = {
    name: string,
    ticker: string,
    count: string,
    avg_price: string,
    current_price: string,
    chg_today: string,
    cost: string,
    value: string,
    profit: string,
    profitability: string,
    profitability_w_dividends: string,
    ytd: string,
    div_ytd: string,
    div_total: string,
    div_year: string,
    yoc: string,
    weight: string,
}

export type PortofilioType = {
    positions: Array<PositionType>,
    totalInvestment: string,
    currentValue: string,
}

class Google {
    sheet_id: string;
    token: string;
    name: string;
    picture_url: string;

    constructor() {
        const cookies = new Cookies();

        this.token = cookies.get('token');
        this.name = cookies.get('name');
        this.picture_url = cookies.get('picture');
        this.sheet_id = cookies.get('sheet');
    }

    static _instance: Google;
    static getInstance(): Google {
        if (this._instance == null) {
            this._instance = new Google();
        }
        return this._instance;
    }

    save(auth: any) {
        const decoded: any = jwt.decode(auth.tokenId);
        new Cookies().set('token', auth.accessToken, { path: '/' });
        new Cookies().set('name', decoded.name, { path: '/' });
        new Cookies().set('picture', decoded.picture, { path: '/' });

        Google._instance = new Google();
    }

    isLogedIn(): boolean {
        return new Cookies().get('token');
    }

    logout(){
        new Cookies().remove('token');
        new Cookies().remove('name');
        new Cookies().remove('picture');

        Google._instance = new Google();
    }

    isSheetValid():boolean{
        return this.sheet_id != '';
    }

    setSheetID(id:string){
        this.sheet_id = id;
        new Cookies().set('sheet', id, {path: '/'});
    }
    async getPortfolio() {

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheet_id}/values/Cartera!A:W`;
        try {
            const { data } = await axios.get(url, this.headers());
            return this.parsePortfolioSheet(data.values);
        } catch (e){
            console.log(e)
            return '';
        }
    }

    // Aux methods
    headers = () => {
        return {
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        }
    }

    parsePortfolioSheet(data: any[][]) {
        console.log(data)
        var result: PortofilioType = {
            positions: [],
            totalInvestment: data[4][2],
            currentValue: data[5][2],
        };

        var row = 12;
        while (data[row][1] != 'Plusvalías') {
            result.positions.push({
                name: data[row][1],
                ticker: data[row][2],
                count: data[row][3],
                avg_price: data[row][5],
                current_price: data[row][6],
                chg_today: data[row][7],
                cost: data[row][9],
                value: data[row][10],
                profit: data[row][11],
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
        console.log(result)
        return result;
    }
}

export default Google;
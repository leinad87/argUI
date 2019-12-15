import React, { useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Google, { PortofilioType, PositionType } from './Google';
import { CircularProgress } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  title: {
    color: 'red'
  },
  list: {
    'list-style': 'none',
    'padding': '0px'
  },
  listelement: {
    margin: '5px',
  }
});



export default function Portfolio() {
  const classes = useStyles();
  const [data, setData] = React.useState();
  useEffect(() => {
    Google.getInstance().getPortfolio().then((d) => setData(d));
  }, []);

  function position(pos: PositionType) {
    return (
      <li className={classes.listelement}>
        <Paper>
          <ul className={classes.list}>
            <li>{pos.ticker}: {pos.count}@{pos.avg_price} </li>
            <li>Current price: {pos.current_price} ( {pos.chg_today})</li>
            <li>{pos.value}</li>
            <li>{pos.profit}</li>
            <li>{pos.div_total}</li>
            <li>{pos.profitability}</li>
            <li>{pos.profitability_w_dividends}</li>
            <li>{pos.weight}</li>
          </ul>
        </Paper>
      </li>
    )
  }

  if (!data) {
    return (<CircularProgress />)
  } else {
    console.log(data.positions[2])

    return (
      <ul className={classes.list}>
        {data.positions.map((p: any) => <li>{position(p)}</li>)}
      </ul>
    )
  }
}
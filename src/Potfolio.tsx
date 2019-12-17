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
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Google, { PortofilioType, PositionType } from './Google';
import { CircularProgress, Grid, CardHeader, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { Link, Router, Route, Switch } from 'react-router-dom';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import DenseTable from './DenseTable';
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
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
  list: {
    'list-style': 'none',
    'padding': '0px'
  },
  listelement: {
    margin: '5px',
  },
  card_red_border: {
    'border-left': '6px solid red',
  },
  card_green_border: {
    'border-left': '6px solid #00ff64',
  },
  card_neutral_border: {
    'border-left': '6px solid #868686',
  },
  summaryList: {
    'column-count': 4,
    'list-style': 'none',

  }
});



export default function Portfolio() {
  const classes = useStyles();
  const [data, setData] = React.useState();
  const [value, setValue] = React.useState(0);


  useEffect(() => {
    Google.getInstance().getPortfolio().then((d) => setData(d));
  }, []);

  function border_class(profit: number) {
    if (profit < 0) return classes.card_red_border
    if (profit > 0) return classes.card_green_border
    else return classes.card_neutral_border
  }

  function position(pos: PositionType) {
    return (
      <Card className={border_class(pos.profit)}>
        <CardContent>
          <ul className={classes.summaryList}>
            <li><span>{pos.ticker}</span>{pos.count + "@" + pos.avg_price}</li>
            <li>Current price: {pos.current_price} ({pos.chg_today})</li>
            <li>{pos.value}</li>
            <li>{pos.profit}</li>
            <li>{pos.div_total}</li>
            <li>{pos.profitability}</li>
            <li>{pos.profitability_w_dividends}</li>
            <li>{pos.weight}</li>
          </ul>
        </CardContent>
      </Card>
    )
  }

  const summary = (
    <Grid item xs={12}>
      <Card >
        <CardContent>
          <ul className={classes.summaryList}>
            <li>Inversión total</li>
            <li>Valor actual de cartera</li>
            <li>Rendimiento sin dividendo</li>
            <li>Rendimiento con dividendo</li>
            <li>Rentabilidad 2019</li>
            <li>Rentabilidad total</li>
          </ul>
        </CardContent>

      </Card>
    </Grid >
  )


  if (!data) {
    return (<CircularProgress />)
  } else {
    return (
      <div>

        <Switch>
          <Route path='/charts'>
            <a>hola</a>
          </Route>
          <Route path='/'>
            <Grid container spacing={3}>
              {summary}
              {data.positions.map((p: any) => <Grid item xs={12}>{position(p)}</Grid>)}
            </Grid>
          </Route>
        </Switch>


        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            console.log(event)
            setValue(newValue);
          }}
          showLabels
          className={classes.stickToBottom}
        >
          <BottomNavigationAction label="Recents" component={Link} to="/signal" value="signal" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Charts" component={Link} to="/charts" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </div >
    )
  }
}
/*
<Router>
<div className="app">
  <Route path="/" component={renderContent()} />
  <PrimaryNav />
</div>
</Router>

*/
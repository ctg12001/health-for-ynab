import { makeStyles, Paper, Typography } from '@material-ui/core';
import React  from 'react';
import Currency from './Currency';

interface CurrencyDisplayProps {
    amount: number,
    title: string;
}

const useStyles = makeStyles((theme) => ({
    paper: {
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
}));

const CurrencyDisplay = (props: CurrencyDisplayProps) => {
    const { amount, title } = props;

    const classes = useStyles();

    return <Paper className={classes.paper}>
        <Typography variant="h5"><Currency amount={amount}/></Typography>
        <Typography variant="subtitle2">{title}</Typography>
    </Paper>
};

export default CurrencyDisplay;
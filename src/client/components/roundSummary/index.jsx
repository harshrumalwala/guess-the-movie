import React from 'react';
import RoundHeader from '../roundHeader';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    width: '20%'
  }
}));

const RoundSummary = ({ currentDetails }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <RoundHeader isSummary={true} />
    </div>
  );
};

export default RoundSummary;

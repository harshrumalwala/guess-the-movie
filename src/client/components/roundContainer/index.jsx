import React from 'react';
import RoundHeader from '../roundHeader';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    flexGrow: 1
  }
}));

const RoundContainer = ({
  round,
  roundLimit,
  roundMovieId,
  roundCompleted,
  roundStartedAt,
   setCurrentDetails
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <RoundHeader
        round={round}
        roundLimit={roundLimit}
        roundStartedAt={roundStartedAt}
      />
    </div>
  );
};

export default RoundContainer;

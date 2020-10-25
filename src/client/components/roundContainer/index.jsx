import React from 'react';
import 'date-fns';
import RoundHeader from '../roundHeader';
import { makeStyles } from '@material-ui/core/styles';
import RoundQuestion from '../roundQuestion';

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
  currentDetails,
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
      <RoundQuestion
        currentDetails={currentDetails}
        setCurrentDetails={setCurrentDetails}
        roundMovieId={roundMovieId}
      />
    </div>
  );
};

export default RoundContainer;

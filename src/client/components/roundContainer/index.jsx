import React from 'react';
import 'date-fns';
import RoundHeader from '../roundHeader';
import { makeStyles } from '@material-ui/core/styles';
import RoundQuestion from '../roundQuestion';
import RoundList from '../roundList';
import _ from 'lodash';
import { isRoundActive } from 'client/components/util';

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
  setCurrentDetails,
  guessList,
  setGuessList,
  onRoundComplete,
  timeLeft
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <RoundHeader round={round} roundLimit={roundLimit} timeLeft={timeLeft} />
      {isRoundActive(roundStartedAt) && (
        <RoundQuestion
          guessListSize={_.size(guessList)}
          currentDetails={currentDetails}
          setCurrentDetails={setCurrentDetails}
          setGuessList={setGuessList}
          roundMovieId={roundMovieId}
        />
      )}
      <RoundList guessList={guessList} />
    </div>
  );
};

export default RoundContainer;

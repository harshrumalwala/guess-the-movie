import React, { useState } from 'react';
import 'date-fns';
import RoundHeader from '../roundHeader';
import { makeStyles } from '@material-ui/core/styles';
import RoundQuestion from '../roundQuestion';
import RoundList from '../roundList';
import _ from 'lodash';

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
  const [guessList, setGuessList] = useState([]);

  return (
    <div className={classes.root}>
      <RoundHeader
        round={round}
        roundLimit={roundLimit}
        roundStartedAt={roundStartedAt}
      />
      <RoundQuestion
        guessListSize={_.size(guessList)}
        currentDetails={currentDetails}
        setCurrentDetails={setCurrentDetails}
        setGuessList={setGuessList}
        roundMovieId={roundMovieId}
      />
      <RoundList guessList={guessList} />
    </div>
  );
};

export default RoundContainer;

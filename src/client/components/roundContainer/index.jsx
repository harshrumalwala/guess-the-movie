import React from 'react';
import 'date-fns';
import RoundHeader from '../roundHeader';
import { makeStyles } from '@material-ui/core/styles';
import RoundQuestion from '../roundQuestion';
import RoundList from '../roundList';
import _ from 'lodash';
import { isRoundActive } from 'client/components/util';
import { useCurrentUser } from 'client/hooks';
import movieTime from 'images/movieTime.png';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    flexGrow: 1,
    backgroundImage: `url(${movieTime})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
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
  timeLeft
}) => {
  const classes = useStyles();
  const { userId } = useCurrentUser();
  const hasCompletedRound =
    _.chain(roundCompleted)
      .filter(['id', parseInt(userId)])
      .size()
      .value() > 0;

  return (
    <div className={classes.root}>
      <RoundHeader round={round} roundLimit={roundLimit} timeLeft={timeLeft} />
      {isRoundActive(roundStartedAt, _.size(guessList)) &&
        !hasCompletedRound && (
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

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
import Typography from '@material-ui/core/Typography';
import { gql, useQuery } from '@apollo/react-hooks';
import { MAX_GUESSES, MAX_ROUND_TIME } from 'client/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    flexGrow: 1,
    backgroundImage: `url(${movieTime})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  movieRoot: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  },
  movieCard: {
    width: 'fit-content',
    borderRadius: '10px',
    padding: theme.spacing(2),
    backgroundImage: 'linear-gradient(to right, #ff512f, #dd2476)',
    color: 'gold',
    boxShadow: '0 4px 8px 0 grey, 0 6px 20px 0 gray'
  }
}));

export const GET_MOVIE = gql`
  query GetMovie($id: Int!) {
    movie(id: $id) {
      name
    }
  }
`;

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
  timeLeft,
  penalty,
  displayMovieId
}) => {
  const classes = useStyles();
  const { userId } = useCurrentUser();
  const hasCompletedRound =
    _.chain(roundCompleted)
      .filter(['id', parseInt(userId)])
      .size()
      .value() > 0;
  const { data } = useQuery(GET_MOVIE, {
    variables: { id: displayMovieId ?? 0 }
  });

  console.log(timeLeft, displayMovieId, data);

  return (
    <div className={classes.root}>
      <RoundHeader round={round} roundLimit={roundLimit} timeLeft={timeLeft} />
      {isRoundActive(roundStartedAt, penalty) &&
        _.size(guessList) < MAX_GUESSES &&
        !hasCompletedRound && (
          <RoundQuestion
            guessListSize={_.size(guessList)}
            currentDetails={currentDetails}
            setCurrentDetails={setCurrentDetails}
            setGuessList={setGuessList}
            roundMovieId={roundMovieId}
          />
        )}
      {((round !== 1 && timeLeft > MAX_ROUND_TIME) ||
        (timeLeft <= 0 && round === roundLimit)) && (
        <div className={classes.movieRoot}>
          <Typography className={classes.movieCard} component="h3">
            The movie was{' '}
            <b>
              <i>{data?.movie?.name}</i>
            </b>
          </Typography>
        </div>
      )}
      <RoundList guessList={guessList} />
    </div>
  );
};

export default RoundContainer;

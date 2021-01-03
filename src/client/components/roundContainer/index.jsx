import React from 'react';
import 'date-fns';
import RoundHeader from '../roundHeader';
import { makeStyles } from '@material-ui/core/styles';
import RoundQuestion from '../roundQuestion';
import RoundList from '../roundList';
import _ from 'lodash';
import { isRoundActive } from 'client/components/util';
import movieTime from 'images/movieTime.png';
import Typography from '@material-ui/core/Typography';
import { gql, useQuery } from '@apollo/react-hooks';
import { MAX_GUESSES, MAX_ROUND_TIME } from 'client/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    flexGrow: 1,
    backgroundImage: `url(${movieTime})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '46vh',
    [theme.breakpoints.up('md')]: {
      height: '88vh'
    }
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
  roundStartedAt,
  currentDetails,
  setCurrentDetails,
  guessList,
  setGuessList,
  timeLeft,
  penalty,
  displayMovieId,
  isGuessed,
  hasAllCompletedRound,
  host
}) => {
  const classes = useStyles();
  const { data } = useQuery(GET_MOVIE, {
    variables: { id: displayMovieId ?? 0 }
  });

  return (
    <div className={classes.root}>
      <RoundHeader
        round={round}
        roundLimit={roundLimit}
        timeLeft={timeLeft}
        isGuessed={isGuessed}
        hasAllCompletedRound={hasAllCompletedRound}
        host={host}
      />
      {isRoundActive(roundStartedAt, penalty, isGuessed) &&
        _.size(guessList) < MAX_GUESSES && (
        <RoundQuestion
          guessListSize={_.size(guessList)}
          currentDetails={currentDetails}
          setCurrentDetails={setCurrentDetails}
          setGuessList={setGuessList}
          roundMovieId={roundMovieId}
        />
      )}
      {!_.isNil(round) &&
        !_.isNil(roundLimit) &&
        ((round > 1 && timeLeft > MAX_ROUND_TIME) ||
          (hasAllCompletedRound && round === roundLimit)) && (
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

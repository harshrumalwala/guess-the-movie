import React, { useState, useEffect } from 'react';
import RoundHeader from '../roundHeader';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import { gql, useLazyQuery } from '@apollo/react-hooks';
import { isRoundActive } from 'client/components/util';
import titanic from 'images/titanic.jpg';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import { green } from '@material-ui/core/colors';
import { usePrevious } from 'client/hooks';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '30vh',
    [theme.breakpoints.up('md')]: {
      height: '88vh'
    },
    margin: theme.spacing(1),
    backgroundImage: `url(${titanic})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    overflow: 'auto'
  },
  guessMovie: {
    margin: theme.spacing(2),
    display: 'flex',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px 0 grey, 0 6px 20px 0 lightSalmon'
  },
  input: {
    flex: 1
  },
  summary: {
    marginTop: theme.spacing(2)
  },
  buttonSuccess: {
    backgroundColor: green[500],
    color: 'white'
  },
  success: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  },
  loader: {
    height: '56px',
    width: '100%'
  }
}));

const enrichData = (currentDetails) => {
  let formattedReleasedAfterDate, formattedReleasedBeforeDate;
  if (currentDetails?.releasedAfter) {
    const releasedAfterDate = new Date(currentDetails.releasedAfter);
    formattedReleasedAfterDate = `${releasedAfterDate.getDate()}/${
      releasedAfterDate.getMonth() + 1
    }/${releasedAfterDate.getFullYear()}`;
  }
  if (currentDetails?.releasedBefore) {
    const releasedBeforeDate = new Date(currentDetails.releasedBefore);
    formattedReleasedBeforeDate = `${releasedBeforeDate.getDate()}/${
      releasedBeforeDate.getMonth() + 1
    }/${releasedBeforeDate.getFullYear()}`;
  }
  return _.assign(
    {},
    currentDetails?.language && {
      'Primary Language': currentDetails.language
    },
    currentDetails?.director && {
      Director: currentDetails.director
    },
    currentDetails?.cast && {
      Cast: _.join(currentDetails.cast, ', ')
    },
    currentDetails?.genre && {
      Genre: _.join(currentDetails.genre, ', ')
    },
    currentDetails?.releasedAfter && currentDetails?.releasedBefore
      ? {
          Released: `Between ${formattedReleasedAfterDate} - ${formattedReleasedBeforeDate}`
        }
      : currentDetails?.releasedAfter
      ? { Released: `After ${formattedReleasedAfterDate}` }
      : currentDetails?.releasedBefore && {
          Released: `Before ${formattedReleasedBeforeDate}`
        },
    currentDetails?.collectionGt && currentDetails?.collectionLt
      ? {
          'Box Office Collection': `Between $${
            currentDetails.collectionGt / 1000000
          } million - $${currentDetails.collectionLt / 1000000} million`
        }
      : currentDetails?.collectionGt
      ? {
          'Box Office Collection': `More than $${
            currentDetails.collectionGt / 1000000
          } million`
        }
      : currentDetails?.collectionLt && {
          'Box Office Collection': `Less than $${
            currentDetails.collectionLt / 1000000
          } million`
        }
  );
};

const CHECK_MOVIE = gql`
  query CheckMovie($id: Int!, $name: String!) {
    isMovie(id: $id, name: $name)
  }
`;

const StyledTableCell = withStyles((theme) => ({
  body: {
    color: 'gold'
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundImage: 'linear-gradient(to right, #a5204a  , #1d2671)'
  }
}))(TableRow);

const RoundSummary = ({
  currentDetails,
  roundMovieId,
  onRoundComplete,
  roundStartedAt,
  timeLeft,
  isGuessed,
  round,
  setPenalty,
  penalty,
  prevRound,
  hasAllCompletedRound,
  host
}) => {
  const classes = useStyles();
  const [movie, setMovie] = useState('');
  const [checkMovie, { loading, data }] = useLazyQuery(CHECK_MOVIE);
  const prevLoading = usePrevious(loading);

  useEffect(() => {
    if (round !== prevRound) {
      checkMovie({
        variables: { id: 1, name: 'movie' }
      });
    }
  }, [timeLeft, checkMovie, prevRound, round]);

  useEffect(() => {
    prevLoading &&
      !loading &&
      !data?.isMovie &&
      setPenalty((penalty) => penalty + 1);
  }, [loading, prevLoading, setPenalty, data]);

  useEffect(() => {
    data?.isMovie && onRoundComplete(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleGuessMovie = () => {
    if (!loading) {
      checkMovie({
        variables: { id: roundMovieId, name: movie }
      });
      setMovie('');
    }
  };

  return (
    <div className={classes.root}>
      <RoundHeader isSummary={true} round={round} host={host} />
      {isRoundActive(roundStartedAt, penalty, isGuessed) && (
        <div className={classes.guessMovie}>
          {!loading ? (
            <TextField
              id="guess-movie"
              label="Guess Movie"
              color="primary"
              className={classes.input}
              variant="filled"
              value={movie}
              onChange={(e) => setMovie(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGuessMovie()}
              autoComplete="off"
              autoFocus={true}
            />
          ) : (
            <LinearProgress className={classes.loader} />
          )}
        </div>
      )}
      {data?.isMovie && !hasAllCompletedRound && (
        <div className={classes.success}>
          <Fab aria-label="correct" className={classes.buttonSuccess}>
            <CheckIcon />
          </Fab>
        </div>
      )}
      <Table size="small" className={classes.summary}>
        <TableBody>
          {_.map(enrichData(currentDetails), (value, key) => (
            <StyledTableRow key={key}>
              <StyledTableCell component="th" scope="row">
                {key}
              </StyledTableCell>
              <StyledTableCell>{value}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoundSummary;

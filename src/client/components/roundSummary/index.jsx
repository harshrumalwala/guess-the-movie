import React, { useState, useEffect } from 'react';
import RoundHeader from '../roundHeader';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TextField from '@material-ui/core/TextField';
import { gql, useLazyQuery } from '@apollo/react-hooks';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isRoundActive } from 'client/components/util';
import titanic from 'images/titanic.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    width: '20%',
    backgroundImage: `url(${titanic})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  },
  guessMovie: {
    margin: theme.spacing(2),
    display: 'flex',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px 0 grey, 0 6px 20px 0 lightSalmon'
  },
  correctGuess: {
    margin: theme.spacing(2),
    borderRadius: '10px',
    height: '40px',
    backgroundColor: 'limegreen',
    color:'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 4px 0 grey, 0 5px 10px 0 lightSalmon'
  },
  input: {
    flex: 1
  },
  summary: {
    marginTop: theme.spacing(3)
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
  round,
  guessList
}) => {
  const classes = useStyles();
  const [movie, setMovie] = useState('');
  const [checkMovie, { loading, data }] = useLazyQuery(CHECK_MOVIE);

  useEffect(() => {
    if (timeLeft === 90) {
      checkMovie({
        variables: { id: 1, name: 'movie' }
      });
    }
  }, [timeLeft, checkMovie]);

  useEffect(() => {
    if (data?.isMovie === true) {
      onRoundComplete(true);
    }
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
      <RoundHeader isSummary={true} round={round} />
      {isRoundActive(roundStartedAt, _.size(guessList)) &&
        (!data?.isMovie ? (
          <div className={classes.guessMovie}>
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
            />
          </div>
        ) : (
          <Typography className={classes.correctGuess}>
            Correct
          </Typography>
        ))}
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

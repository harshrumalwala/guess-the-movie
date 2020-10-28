import React, { useState, useEffect } from 'react';
import RoundHeader from '../roundHeader';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    width: '20%'
  },
  guessMovie: {
    margin: theme.spacing(2),
    display: 'flex',
    color: 'green',
    backgroundColor: 'azure'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
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
          'Estimated Box Office Collection': `Between $${
            currentDetails.collectionGt / 1000000
          } million - $${currentDetails.collectionLt / 1000000} million`
        }
      : currentDetails?.collectionGt
      ? {
          'Estimated Box Office Collection': `More than $${
            currentDetails.collectionGt / 1000000
          } million`
        }
      : currentDetails?.collectionLt && {
          'Estimated Box Office Collection': `Less than $${
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

const RoundSummary = ({
  currentDetails,
  roundMovieId,
  onRoundComplete,
  roundStartedAt,
  timeLeft,
  round
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
    checkMovie({
      variables: { id: roundMovieId, name: movie }
    });
    setMovie('');
  };

  return (
    <div className={classes.root}>
      <RoundHeader isSummary={true} round={round} />
      {isRoundActive(roundStartedAt) &&
        (!data?.isMovie ? (
          <div className={classes.guessMovie}>
            <TextField
              id="guess-movie"
              label="Guess Movie"
              color="primary"
              className={classes.input}
              value={movie}
              onChange={(e) => setMovie(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGuessMovie()}
              autoComplete="off"
            />
            {loading ? (
              <CircularProgress className={classes.iconButton} />
            ) : (
              <IconButton
                type="submit"
                className={classes.iconButton}
                onClick={handleGuessMovie}
              >
                <ChevronRightIcon color="primary" />
              </IconButton>
            )}
          </div>
        ) : (
          <Typography className={classes.guessMovie}>
            Correct Guess!!!
          </Typography>
        ))}
      <Table size="small">
        <TableBody>
          {_.map(enrichData(currentDetails), (value, key) => (
            <TableRow key={key}>
              <TableCell component="th" scope="row">
                {key}
              </TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoundSummary;

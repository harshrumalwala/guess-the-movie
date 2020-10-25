import React, { useState, useEffect } from 'react';
import 'date-fns';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  questionValues,
  parameterValues,
  questionParameterMap,
  GET_DIRECTORS,
  GET_LANGUAGES,
  GET_GENRES,
  GET_CAST,
  populateReleasedDate,
  populateCollection
} from './util';
import { useQuery } from '@apollo/react-hooks';
import { Loader } from 'client/components';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import { useVerifyGuess } from 'client/hooks';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  questionFormControl: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    minWidth: 250
  },
  parameterFormControl: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    minWidth: 120
  },
  guessFormControl: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  collection: {
    width: 120
  },
  checkButton: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(2)
  }
}));

const RoundQuestion = ({ currentDetails, setCurrentDetails, roundMovieId }) => {
  const { loading: loadingCast, error: castError, data: castData } = useQuery(
    GET_CAST
  );
  const {
    loading: loadingDirectors,
    error: directorsError,
    data: directorsData
  } = useQuery(GET_DIRECTORS);
  const {
    loading: loadingGenres,
    error: genresError,
    data: genresData
  } = useQuery(GET_GENRES);
  const {
    loading: loadingLanguages,
    error: languagesError,
    data: languagesData
  } = useQuery(GET_LANGUAGES);
  const classes = useStyles();
  const [question, setQuestion] = useState('');
  const [parameter, setParameter] = useState('');
  const [isParameterDisabled, setIsParameterDisabled] = useState(true);
  const [guess, setGuess] = useState('');
  const [guessValues, setGuessValues] = useState([]);
  const [isGuessDisabled, setIsGuessDisabled] = useState(true);
  const [isGuessDateDisabled, setIsGuessDateDisabled] = useState(true);
  const [isGuessFreeTextDisabled, setIsGuessFreeTextDisabled] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { verifyGuess, loading, data, setData } = useVerifyGuess();

  useEffect(() => {
    const reset = () => {
      setData(undefined);
      setQuestion('');
      setParameter('');
      setGuess('');
    };

    const updateCurrentDetails = () => {
      switch (question) {
        case 0:
          data &&
            setCurrentDetails({ ...currentDetails, language: `${guess}` });
          break;
        case 1:
          data &&
            setCurrentDetails({ ...currentDetails, director: `${guess}` });
          break;
        case 2:
          data &&
            setCurrentDetails({
              ...currentDetails,
              cast: currentDetails?.cast
                ? _.uniq([...currentDetails.cast, guess])
                : [guess]
            });
          break;
        case 3:
          data &&
            setCurrentDetails({
              ...currentDetails,
              genre: currentDetails?.genre
                ? _.uniq([...currentDetails.genre, guess])
                : [guess]
            });
          break;
        case 4:
          setCurrentDetails(populateReleasedDate(currentDetails, guess, data));
          break;
        case 5:
          setCurrentDetails(populateCollection(currentDetails, guess, data));
          break;
        default:
          break;
      }
    };

    if (data === true || data === false) {
      updateCurrentDetails();
      reset();
    }
  }, [
    data,
    setData,
    currentDetails,
    parameter,
    question,
    guess,
    setCurrentDetails
  ]);

  useEffect(() => {
    const disableGuessFields = () => {
      setIsGuessDateDisabled(true);
      setIsGuessFreeTextDisabled(true);
      setIsGuessDisabled(true);
    };

    if (question === 4) {
      setIsParameterDisabled(false);
      disableGuessFields();
      if (parameter !== '') {
        setIsGuessDateDisabled(false);
        handleDateChange(selectedDate);
      }
    } else if (question === 5) {
      setIsParameterDisabled(false);
      disableGuessFields();
      parameter !== '' && setIsGuessFreeTextDisabled(false);
    } else {
      setIsParameterDisabled(true);
      disableGuessFields();
      question !== '' && setIsGuessDisabled(false);
    }
  }, [question, parameter, selectedDate]);

  useEffect(() => {
    if (!isGuessDisabled) {
      switch (question) {
        case 0:
          setGuessValues(_.map(languagesData.languages, 'name'));
          break;
        case 1:
          setGuessValues(_.map(directorsData.directors, 'name'));
          break;
        case 2:
          setGuessValues(_.map(castData.cast, 'name'));
          break;
        case 3:
          setGuessValues(_.map(genresData.genres, 'name'));
          break;
        default:
          setGuessValues([]);
      }
    }
  }, [
    question,
    castData,
    directorsData,
    genresData,
    languagesData,
    isGuessDisabled
  ]);

  if (loadingCast || loadingDirectors || loadingGenres || loadingLanguages)
    return <Loader />;

  if (castError || directorsError || genresError || languagesError)
    return <h1>Something went wrong while loading data!</h1>;

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setGuess(
      new Date(
        date.setHours(0, 0, 0, 0) - date.getTimezoneOffset() * 60 * 1000
      ).toISOString()
    );
  };

  const resetValues = () => {
    setGuess('');
    setSelectedDate(new Date());
    setParameter('');
  };

  const handleQuestionChange = (event) => {
    resetValues();
    setQuestion(event.target.value);
  };

  const handleParameterChange = (event) => {
    setParameter(event.target.value);
  };

  const handleGuessChange = (event, newValue) => {
    newValue && setGuess(newValue);
  };

  const handleCollectionChange = (event) => {
    const value = event.target.value;
    setGuess(Number(value) ? value * 1000000 : value);
  };

  const handleVerifyGuess = () => {
    verifyGuess(question, parameter, guess, roundMovieId);
  };

  return (
    <>
      <FormControl className={classes.questionFormControl}>
        <InputLabel id="question-label">Question</InputLabel>
        <Select id="question" value={question} onChange={handleQuestionChange}>
          {_.map(questionValues, (value, key) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {!isParameterDisabled && (
        <FormControl className={classes.parameterFormControl}>
          <InputLabel id="parameter-label">Parameter</InputLabel>
          <Select
            id="parameter"
            value={parameter}
            onChange={handleParameterChange}
          >
            {_.chain(parameterValues)
              .filter((value, key) =>
                _.includes(questionParameterMap[question], key)
              )
              .map((value, key) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))
              .value()}
          </Select>
        </FormControl>
      )}
      {!isGuessDisabled && (
        <FormControl className={classes.guessFormControl}>
          <Autocomplete
            id="guess"
            options={guessValues}
            style={{ minWidth: 200 }}
            value={guess}
            onChange={handleGuessChange}
            renderInput={(params) => <TextField {...params} label="Guess" />}
          />
        </FormControl>
      )}
      {!isGuessDateDisabled && (
        <FormControl className={classes.guessFormControl}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              disableFuture
              disableToolbar
              autoOk
              openTo="year"
              variant="inline"
              format="MM/dd/yyyy"
              id="guess-date"
              label="Guess"
              views={['year', 'month', 'date']}
              value={selectedDate}
              onChange={handleDateChange}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      )}
      {!isGuessFreeTextDisabled && (
        <FormControl className={classes.guessFormControl}>
          <TextField
            className={classes.collection}
            autoComplete="off"
            id="guess-collection"
            label="Guess"
            value={Number(guess) ? guess / 1000000 : guess}
            onChange={handleCollectionChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">MM</InputAdornment>
            }}
          />
        </FormControl>
      )}
      {(Number(guess) || !_.isEmpty(guess)) &&
        (!loading ? (
          <IconButton
            color="primary"
            className={classes.checkButton}
            aria-label="Guess"
            onClick={handleVerifyGuess}
          >
            <SendIcon />
          </IconButton>
        ) : (
          <CircularProgress className={classes.checkButton} />
        ))}
    </>
  );
};

export default RoundQuestion;

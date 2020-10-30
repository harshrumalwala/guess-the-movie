import React, { useState, useEffect } from 'react';
import 'date-fns';
import _ from 'lodash';
import { makeStyles, withStyles } from '@material-ui/core/styles';
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
  populateCollection,
  populateCast,
  populateGenre,
  isNumber
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
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  questionFormControl: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    minWidth: 250,
    backgroundColor: 'white',
    boxShadow: '0 4px 8px 0 grey, 0 6px 20px 0 grey'
  },
  parameterFormControl: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    minWidth: 120,
    backgroundColor: 'white',
    boxShadow: '0 4px 8px 0 grey, 0 6px 20px 0 grey'
  },
  guessFormControl: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    backgroundColor: 'white',
    boxShadow: '0 4px 8px 0 grey, 0 6px 20px 0 grey'
  },
  collection: {
    width: 120
  },
  checkButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2)
  }
}));

const StyledInputAdornment = withStyles((theme) => ({
  positionEnd: {
    marginTop: '16px'
  }
}))(InputAdornment);

const RoundQuestion = ({
  setCurrentDetails,
  roundMovieId,
  setGuessList,
  guessListSize
}) => {
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
            setCurrentDetails((prevDetails) => ({
              ...prevDetails,
              language: `${guess}`
            }));
          break;
        case 1:
          data &&
            setCurrentDetails((prevDetails) => ({
              ...prevDetails,
              director: `${guess}`
            }));
          break;
        case 2:
          data &&
            setCurrentDetails((prevDetails) =>
              populateCast(prevDetails, guess, data)
            );
          break;
        case 3:
          data &&
            setCurrentDetails((prevDetails) =>
              populateGenre(prevDetails, guess, data)
            );
          break;
        case 4:
          setCurrentDetails((prevDetails) =>
            populateReleasedDate(prevDetails, guess, data)
          );
          break;
        case 5:
          setCurrentDetails((prevDetails) =>
            populateCollection(prevDetails, guess, data)
          );
          break;
        default:
          break;
      }
    };

    const updateGuessList = () => {
      let guessValue = guess;
      if (question === 4) {
        const formattedDate = new Date(guess);
        guessValue = `${formattedDate.getDate()}/${
          formattedDate.getMonth() + 1
        }/${formattedDate.getFullYear()}`;
      } else if (question === 5) {
        guessValue = `$${guess / 1000000} million`;
      }

      setGuessList((prevList) => [
        ...prevList,
        {
          guess: `${questionValues[question]}${
            isNumber(parameter)
              ? ` ${parameterValues[parameter].displayValue}`
              : ''
          } - ${guessValue}`,
          result: _.includes([0, 2], parameter) ? !data : data
        }
      ]);
    };

    if (data === true || data === false) {
      updateCurrentDetails();
      updateGuessList();
      reset();
    }
  }, [
    data,
    setData,
    parameter,
    question,
    guess,
    setCurrentDetails,
    setGuessList
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
    setGuess(isNumber(value) ? value * 1000000 : value);
  };

  const handleVerifyGuess = () => {
    verifyGuess(question, parameter, guess, roundMovieId);
  };

  return (
    <div className={classes.root}>
      <FormControl variant="filled" className={classes.questionFormControl}>
        <InputLabel id="question-label">
          Question {guessListSize + 1}
        </InputLabel>
        <Select id="question" value={question} onChange={handleQuestionChange}>
          {_.map(questionValues, (value, key) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {!isParameterDisabled && (
        <FormControl variant="filled" className={classes.parameterFormControl}>
          <InputLabel id="parameter-label">Parameter</InputLabel>
          <Select
            id="parameter"
            value={parameter}
            onChange={handleParameterChange}
          >
            {_.chain(parameterValues)
              .filter((value) =>
                _.includes(questionParameterMap[question], value.key)
              )
              .map((value) => (
                <MenuItem key={value.key} value={value.key}>
                  {value.displayValue}
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
            renderInput={(params) => (
              <TextField variant="filled" {...params} label="Guess" />
            )}
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
              inputVariant="filled"
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
            variant="filled"
            className={classes.collection}
            autoComplete="off"
            id="guess-collection"
            label="Guess"
            value={isNumber(guess) ? guess / 1000000 : guess}
            onChange={handleCollectionChange}
            InputProps={{
              startAdornment: (
                <StyledInputAdornment position="start">$</StyledInputAdornment>
              ),
              endAdornment: (
                <StyledInputAdornment position="end">MM</StyledInputAdornment>
              )
            }}
          />
        </FormControl>
      )}
      {(Number(guess) || !_.isEmpty(guess)) &&
        (!loading ? (
          <IconButton
            className={classes.checkButton}
            aria-label="Guess"
            onClick={handleVerifyGuess}
          >
            <SendIcon style={{ color: 'red', fontSize: 'xx-large' }} />
          </IconButton>
        ) : (
          <CircularProgress
            style={{ color: 'red' }}
            className={classes.checkButton}
          />
        ))}
    </div>
  );
};

export default RoundQuestion;

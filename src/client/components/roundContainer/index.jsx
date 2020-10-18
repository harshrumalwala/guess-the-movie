import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import RoundHeader from '../roundHeader';
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
  GET_CAST
} from './util';
import { useQuery } from '@apollo/react-hooks';
import { Loader } from 'client/components';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    flexGrow: 1
  },
  questionFormControl: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    minWidth: 250
  },
  parameterFormControl: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    minWidth: 100
  },
  guessFormControl: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    minWidth: 250
  }
}));

const RoundContainer = ({
  round,
  roundLimit,
  roundMovieId,
  roundCompleted,
  roundStartedAt,
  setCurrentDetails
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

  useEffect(() => {
    if (_.includes([4, 5], question)) {
      setIsParameterDisabled(false);
      parameter === '' ? setIsGuessDisabled(true) : setIsGuessDisabled(false);
    } else {
      setIsParameterDisabled(true);
      question === '' ? setIsGuessDisabled(true) : setIsGuessDisabled(false);
    }
  }, [question, parameter]);

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

  const handleQuestionChange = (event) => {
    console.log(event.target.value);
    setQuestion(event.target.value);
  };

  if (loadingCast || loadingDirectors || loadingGenres || loadingLanguages)
    return <Loader />;

  if (castError || directorsError || genresError || languagesError)
    return <h1>Something went wrong while loading data!</h1>;

  const handleParameterChange = (event) => {
    setParameter(event.target.value);
  };

  const handleGuessChange = (event, newValue) => {
    newValue && setGuess(newValue);
  };

  return (
    <div className={classes.root}>
      <RoundHeader
        round={round}
        roundLimit={roundLimit}
        roundStartedAt={roundStartedAt}
      />
      <FormControl className={classes.questionFormControl}>
        <InputLabel id="question-label">Question</InputLabel>
        <Select id="question" value={question} onChange={handleQuestionChange}>
          {_.map(questionValues, (questionValue) => (
            <MenuItem key={questionValue.value} value={questionValue.value}>
              {questionValue.displayValue}
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
              .filter((parameter) =>
                _.includes(questionParameterMap[question], parameter.value)
              )
              .map((parameterValue) => (
                <MenuItem
                  key={parameterValue.value}
                  value={parameterValue.value}
                >
                  {parameterValue.displayValue}
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
            style={{ width: 250 }}
            onChange={handleGuessChange}
            renderInput={(params) => <TextField {...params} label="Guess" />}
          />
        </FormControl>
      )}
    </div>
  );
};

export default RoundContainer;

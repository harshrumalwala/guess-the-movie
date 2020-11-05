import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/react-hooks';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { GET_LANGUAGES } from '../roundQuestion/util';
import { Loader } from '..';
import { usePrevious } from 'client/hooks';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(to top, #9795f0 0%, #fbc8d4 100%)'
  },
  sliderFormControl: {
    width: '85%',
    marginBottom: '4px'
  },
  slider: {
    marginTop: theme.spacing(5)
  },
  languageFormControl: {
    width: '85%',
    marginBottom: theme.spacing(2)
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 1
  },
  createButton: {
    marginBottom: theme.spacing(1)
  }
}));

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      host {
        name
      }
      createdAt
    }
  }
`;

const CREATE_ROOM = gql`
  mutation OnCreateRoom($roundLimit: Int!, $languages: [LanguageInput]) {
    createRoom(roundLimit: $roundLimit, languages: $languages) {
      id
    }
  }
`;

export default function CreateRoom() {
  const classes = useStyles();
  const history = useHistory();
  const [round, setRound] = useState(5);
  const [selectedLanguage, setSelectedLanguage] = useState(['English']);
  const [
    updateRoom,
    { loading: newRoomLoading, data: newRoomData }
  ] = useMutation(CREATE_ROOM);
  const { loading, data } = useQuery(GET_LANGUAGES);
  const handleChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
  const languages = _.map(data?.languages, 'name').sort();
  const prevLoading = usePrevious(newRoomLoading);

  useEffect(() => {
    if (prevLoading && !loading && newRoomData?.createRoom) {
      history.push(`/room/${newRoomData?.createRoom.id}`);
    }
  }, [newRoomData, history, prevLoading, loading]);

  if (loading) return <Loader />;

  const handleCreateRoom = () => {
    updateRoom({
      variables: {
        roundLimit: round,
        languages: _.map(selectedLanguage, (language) => ({ name: language }))
      }
    });
  };

  return (
    <div className={classes.root}>
      <FormControl className={classes.sliderFormControl}>
        <InputLabel>Rounds</InputLabel>
        <Slider
          className={classes.slider}
          defaultValue={5}
          step={1}
          min={1}
          max={10}
          valueLabelDisplay="auto"
          onChange={(e, newValue) => setRound(newValue)}
        />
      </FormControl>
      <FormControl className={classes.languageFormControl}>
        <InputLabel>Movie Languages</InputLabel>
        <Select
          multiple
          value={selectedLanguage}
          onChange={handleChange}
          input={<Input />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {languages.map((language) => (
            <MenuItem key={language} value={language}>
              <Checkbox checked={selectedLanguage.indexOf(language) > -1} />
              <ListItemText primary={language} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton onClick={handleCreateRoom} className={classes.createButton}>
        <AddIcon color="primary" />
      </IconButton>
    </div>
  );
}

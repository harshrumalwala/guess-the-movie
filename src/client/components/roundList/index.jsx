import React from 'react';
import _ from 'lodash';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    maxHeight: '60vh',
    overflowY: 'auto'
  }
}));

const StyledListItem = withStyles(() => ({
  root: {
    paddingTop: '2px',
    paddingBottom: '2px'
  }
}))(ListItem);

const StyledListItemText = withStyles(() => ({
  primary: {
    fontSize: '14px',
    fontStyle: 'italic'
  }
}))(ListItemText);

const RoundList = ({ guessList }) => {
  const classes = useStyles();

  const getText = (value, key) => `${_.size(guessList) - key}. ${value.guess}`;

  return (
    <div className={classes.root}>
      <List>
        {_.chain(guessList)
          .slice()
          .reverse()
          .map((value, key) => (
            <StyledListItem key={key} divider={true}>
              <StyledListItemText primary={getText(value, key)} />
              <ListItemIcon>
                {value.result ? (
                  <CheckIcon style={{ color: green[500] }} />
                ) : (
                  <ClearIcon style={{ color: red[500] }} />
                )}
              </ListItemIcon>
            </StyledListItem>
          ))
          .value()}
      </List>
    </div>
  );
};

export default RoundList;

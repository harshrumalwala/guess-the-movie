import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1
  }
}));

const StyledAppBar = withStyles((theme) => ({
  colorSecondary: {
    backgroundColor: 'darkmagenta'
  }
}))(AppBar);

const StyledToolbar = withStyles((theme) => ({
  regular: {
    minHeight: '56px'
  }
}))(Toolbar);

const RoundHeader = ({ round, roundLimit, roundStartedAt, isSummary }) => {
  const classes = useStyles();

  const getTitle = () =>
    isSummary
      ? 'Round Summary'
      : round && round !== 0
      ? `Round ${round} of ${roundLimit}`
      : `Waiting to start the game...`;

  return (
    <StyledAppBar position="static" color="secondary">
      <StyledToolbar>
        <Typography variant="h6" className={classes.title}>
          {getTitle()}
        </Typography>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default RoundHeader;

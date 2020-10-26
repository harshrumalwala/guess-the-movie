import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1
  },
  timer: {
    marginRight: theme.spacing(2)
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

const RoundHeader = ({ round, roundLimit, timeLeft, isSummary }) => {
  const classes = useStyles();

  const getTitle = () =>
    isSummary
      ? 'Round Summary'
      : round && round !== 0
      ? timeLeft <= 90
        ? `Round ${round} of ${roundLimit}`
        : `Next round starting in`
      : `Waiting to start the game...`;

  return (
    <StyledAppBar position="static" color="secondary">
      <StyledToolbar>
        <Typography variant="h6" className={classes.title}>
          {getTitle()}
        </Typography>
        {!isSummary && timeLeft && !isNaN(timeLeft) && timeLeft > 0 && (
          <Typography variant="h6" className={classes.timer}>
            {timeLeft > 90 ? timeLeft - 90 : timeLeft}
          </Typography>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default RoundHeader;

import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Tooltip from '@material-ui/core/Tooltip';
import { useUpdateRoom } from 'client/hooks';
import { MAX_ROUND_TIME } from 'client/constants';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1
  },
  rightAlignedIcon: {
    marginRight: theme.spacing(1)
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

const RoundHeader = ({
  round,
  roundLimit,
  timeLeft,
  isSummary,
  isGuessed,
  hasAllCompletedRound
}) => {
  const classes = useStyles();
  const { roomId } = useParams();
  const { updateRoom } = useUpdateRoom();

  const onRoundRestart = () =>
    updateRoom({
      variables: { id: roomId, isGameRestarted: true }
    });

  const onGameStart = () =>
    updateRoom({
      variables: { id: roomId, isGameReady: true }
    });

  const getTitle = () =>
    isSummary
      ? 'Summary'
      : round && round !== 0
      ? round === roundLimit && hasAllCompletedRound
        ? 'I knew it was only a matter of time. Well done!'
        : isGuessed
        ? 'Waiting for other players to finish'
        : timeLeft >= 0 && timeLeft <= MAX_ROUND_TIME
        ? `Round ${round} of ${roundLimit}`
        : `Next round starting in`
      : `Waiting to start the game`;

  return (
    <StyledAppBar position="static" color="secondary">
      <StyledToolbar>
        <Typography variant="h6" className={classes.title}>
          {getTitle()}
        </Typography>
        {!isSummary && round !== 0 && !isNaN(timeLeft) && timeLeft > 0 && (
          <Typography variant="h6" className={classes.rightAlignedIcon}>
            {timeLeft > MAX_ROUND_TIME ? timeLeft - MAX_ROUND_TIME : timeLeft}
          </Typography>
        )}
        {!isSummary && round === 0 && (
          <Tooltip title="Start Game">
            <IconButton onClick={onGameStart}>
              <PlayArrowIcon style={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        )}
        {isSummary && round !== 0 && (
          <Tooltip title="Restart Game">
            <IconButton onClick={onRoundRestart}>
              <ReplayIcon style={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default RoundHeader;

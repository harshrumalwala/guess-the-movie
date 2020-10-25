import React, { useState } from 'react';
import { useRoom, useUpdateRoom } from 'client/hooks';
import { useParams } from 'react-router-dom';
import { RoundContainer, RoundSummary, Scoreboard } from 'client/components';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(1)
  }
}));

const Room = () => {
  const classes = useStyles();
  const { roomId } = useParams();
  const [currentDetails, setCurrentDetails] = useState();
  const { data } = useRoom();
  const watchRoom = data?.watchRoom;
  const { updateRoom } = useUpdateRoom();

  const onRoundComplete = () => {
    updateRoom({
      variables: { id: roomId, hasCompletedRound: true, score: 50 }
    });
  };

  return (
    <div className={classes.root}>
      <Scoreboard players={watchRoom?.players} />
      <RoundContainer
        round={watchRoom?.round}
        roundMovieId={watchRoom?.roundMovieId}
        roundLimit={watchRoom?.roundLimit}
        roundCompleted={watchRoom?.roundCompleted}
        roundStartedAt={watchRoom?.roundStartedAt}
        setCurrentDetails={setCurrentDetails}
      />
      <RoundSummary currentDetails={currentDetails} />
    </div>
  );
};

export default Room;

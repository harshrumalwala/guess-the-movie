import React from 'react';
import { useRoom, useUpdateRoom } from 'client/hooks';
import _ from 'lodash';
import { Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { QuestionContainer, Scoreboard } from 'client/components';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    margin: '5px 0 0 5px'
  }
}));

const Room = () => {
  const classes = useStyles();
  const { roomId } = useParams();
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
      <QuestionContainer />
    </div>
  );
};

export default Room;

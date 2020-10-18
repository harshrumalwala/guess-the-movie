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

const initialState = {
  releasedAfter: '2011-10-05T14:48:00.000Z',
  releasedBefore: '2013-11-03T14:48:00.000Z',
  genre: ['Sci Fi', 'Thriller'],
  director: 'Tom Cruise',
  cast: [
    'Vin Diesel',
    'Angelina Jolie',
    'Robert Downey Jr.',
    'Chris Hemsworth'
  ],
  collectionGt: 50000000,
  collectionLt: 120000000
};

const Room = () => {
  const classes = useStyles();
  const { roomId } = useParams();
  const [currentDetails, setCurrentDetails] = useState(initialState);
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

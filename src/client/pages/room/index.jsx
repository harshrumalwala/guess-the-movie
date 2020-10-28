import React, { useState, useEffect, useCallback } from 'react';
import { useRoom, useUpdateRoom } from 'client/hooks';
import { useParams } from 'react-router-dom';
import { RoundContainer, RoundSummary, Scoreboard } from 'client/components';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { calculateTimeLeft } from 'client/components/util';

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
  const [guessList, setGuessList] = useState([]);
  const { data } = useRoom();
  const { updateRoom, data: updateRoomData } = useUpdateRoom();
  const watchRoom = data?.watchRoom ?? updateRoomData?.updateRoom;
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(watchRoom?.roundStartedAt)
  );

  useEffect(() => {
    updateRoom({
      variables: { id: roomId }
    });

    const cleanup = () =>
      updateRoom({
        variables: { id: roomId, hasPlayerLeft: true }
      });

    window.addEventListener('beforeunload', cleanup);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRoundComplete = useCallback(
    (isGuessed) => {
      let score = 0;
      if (isGuessed) {
        const pendingTime =
          90 -
          Math.floor(
            (new Date().getTime() -
              new Date(watchRoom?.roundStartedAt).getTime()) /
              1000
          ) -
          10;
        const pendingQuestions = 15 - _.size(guessList);
        score = 20 + pendingTime * 2 + pendingQuestions * 10;
      }
      updateRoom({
        variables: { id: roomId, hasCompletedRound: true, score }
      });
    },
    [guessList, roomId, watchRoom, updateRoom]
  );

  useEffect(() => {
    if (timeLeft === 90 || watchRoom?.round === 0) {
      setGuessList([]);
      setCurrentDetails([]);
    }
  }, [timeLeft, watchRoom]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(watchRoom?.roundStartedAt));
    }, 950);
    if (timeLeft === 0) {
      clearInterval(timer);
      setTimeLeft(-1);
      onRoundComplete(false);
    }
    return () => clearInterval(timer);
  }, [timeLeft, watchRoom, setGuessList, setCurrentDetails, onRoundComplete]);

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
        onRoundComplete={onRoundComplete}
        guessList={guessList}
        setGuessList={setGuessList}
        timeLeft={timeLeft}
      />
      <RoundSummary
        currentDetails={currentDetails}
        roundMovieId={watchRoom?.roundMovieId}
        onRoundComplete={onRoundComplete}
        roundStartedAt={watchRoom?.roundStartedAt}
        timeLeft={timeLeft}
        round={watchRoom?.round}
      />
    </div>
  );
};

export default Room;

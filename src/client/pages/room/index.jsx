import React, { useState, useEffect, useCallback } from 'react';
import { useRoom, useUpdateRoom, usePrevious } from 'client/hooks';
import { useParams } from 'react-router-dom';
import { RoundContainer, RoundSummary, Scoreboard } from 'client/components';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { calculateTimeLeft } from 'client/components/util';
import {
  CORRECT_GUESS_SCORE,
  PENDING_QUESTIONS_SCORE,
  PENDING_TIME_SCORE,
  MAX_GUESSES,
} from 'client/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(1),
    height: 'calc(100vh - 80px)'
  }
}));

const Room = () => {
  const classes = useStyles();
  const { roomId } = useParams();
  const [currentDetails, setCurrentDetails] = useState();
  const [displayMovieId, setDisplayMovieId] = useState();
  const [guessList, setGuessList] = useState([]);
  const { data } = useRoom();
  const [penalty, setPenalty] = useState(0);
  const { updateRoom, data: updateRoomData } = useUpdateRoom();
  const watchRoom = data?.watchRoom ?? updateRoomData?.updateRoom;
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(watchRoom?.roundStartedAt, penalty)
  );
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const prevRound = usePrevious(watchRoom?.round);
  const prevRoundMovieId = usePrevious(watchRoom?.roundMovieId);

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

  useEffect(() => {
    if (
      watchRoom?.round !== 0 &&
      prevRoundMovieId &&
      watchRoom?.round !== prevRound
    ) {
      setDisplayMovieId(prevRoundMovieId);
    }
    if (watchRoom?.round === watchRoom?.roundLimit && timeLeft <= 0) {
      setDisplayMovieId(watchRoom?.roundMovieId);
    }
  }, [watchRoom, prevRound, prevRoundMovieId, timeLeft]);

  useEffect(() => {
    if (prevRound !== watchRoom?.round) {
      setTimeLeft(calculateTimeLeft(watchRoom?.roundStartedAt, 0));
      setIsRoundComplete(false);
      setPenalty(0);
      setGuessList([]);
      setCurrentDetails([]);
    }
  }, [prevRound, watchRoom, penalty]);

  const onRoundComplete = useCallback(
    (isGuessed) => {
      let score = 0;
      if (isGuessed) {
        const pendingTime = calculateTimeLeft(
          watchRoom?.roundStartedAt,
          penalty
        );
        const pendingQuestions = MAX_GUESSES - _.size(guessList);
        score =
          CORRECT_GUESS_SCORE +
          pendingTime * PENDING_TIME_SCORE +
          pendingQuestions * PENDING_QUESTIONS_SCORE;
      }
      updateRoom({
        variables: { id: roomId, hasCompletedRound: true, score }
      });
    },
    [guessList, roomId, watchRoom, updateRoom, penalty]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(watchRoom?.roundStartedAt, penalty));
    }, 950);
    if (timeLeft <= 0 && !isRoundComplete) {
      setIsRoundComplete(true);
    }
    return () => clearInterval(timer);
  }, [
    timeLeft,
    watchRoom,
    setGuessList,
    setCurrentDetails,
    onRoundComplete,
    isRoundComplete,
    penalty
  ]);

  useEffect(() => {
    if (isRoundComplete) {
      onRoundComplete(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoundComplete]);

  return (
    <div className={classes.root}>
      <Scoreboard
        players={watchRoom?.players}
        roundCompleted={watchRoom?.roundCompleted}
      />
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
        penalty={penalty}
        displayMovieId={displayMovieId}
      />
      <RoundSummary
        currentDetails={currentDetails}
        roundMovieId={watchRoom?.roundMovieId}
        onRoundComplete={onRoundComplete}
        roundStartedAt={watchRoom?.roundStartedAt}
        timeLeft={timeLeft}
        round={watchRoom?.round}
        prevRound={prevRound}
        guessList={guessList}
        setPenalty={setPenalty}
        penalty={penalty}
      />
    </div>
  );
};

export default Room;

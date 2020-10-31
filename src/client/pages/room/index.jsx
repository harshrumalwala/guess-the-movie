import React, { useState, useEffect, useCallback } from 'react';
import {
  useRoom,
  useUpdateRoom,
  usePrevious,
  useCurrentUser
} from 'client/hooks';
import { useParams } from 'react-router-dom';
import { RoundContainer, RoundSummary, Scoreboard } from 'client/components';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { calculateTimeLeft } from 'client/components/util';
import {
  CORRECT_GUESS_SCORE,
  PENDING_QUESTIONS_SCORE,
  PENDING_TIME_SCORE,
  MAX_GUESSES
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
  const { userId } = useCurrentUser();
  const [currentDetails, setCurrentDetails] = useState();
  const [displayMovieId, setDisplayMovieId] = useState();
  const [guessList, setGuessList] = useState([]);
  const { data } = useRoom();
  const [penalty, setPenalty] = useState(0);
  const { updateRoom, data: updateRoomData } = useUpdateRoom();
  const watchRoom = data?.watchRoom ?? updateRoomData?.updateRoom;
  const [isGuessed, setIsGuessed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(watchRoom?.roundStartedAt, penalty, isGuessed)
  );
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const hasAllCompletedRound =
    _.size(watchRoom?.players) === _.size(watchRoom?.roundCompleted);
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
    if (watchRoom?.round === watchRoom?.roundLimit && hasAllCompletedRound) {
      setDisplayMovieId(watchRoom?.roundMovieId);
    }
  }, [watchRoom, prevRound, prevRoundMovieId, timeLeft, hasAllCompletedRound]);

  useEffect(() => {
    if (prevRound !== watchRoom?.round) {
      setTimeLeft(calculateTimeLeft(watchRoom?.roundStartedAt, 0, false));
      setIsGuessed(false);
      setIsRoundComplete(false);
      setPenalty(0);
      setGuessList([]);
      setCurrentDetails([]);
    }
    if (
      watchRoom?.round === watchRoom?.roundLimit &&
      _.size(watchRoom?.players) === _.size(watchRoom?.roundCompleted)
    ) {
      setGuessList([]);
      setCurrentDetails([]);
    }
  }, [prevRound, watchRoom, penalty, isGuessed, userId]);

  const onRoundComplete = useCallback(
    (hasGuessed) => {
      let score = 0;
      setIsGuessed(hasGuessed);
      if (hasGuessed) {
        const pendingTime = calculateTimeLeft(
          watchRoom?.roundStartedAt,
          penalty,
          isGuessed
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
      setTimeLeft(0);
      setIsRoundComplete(true);
    },
    [guessList, roomId, watchRoom, updateRoom, penalty, isGuessed]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(
        calculateTimeLeft(watchRoom?.roundStartedAt, penalty, isGuessed)
      );
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
    penalty,
    isGuessed
  ]);

  useEffect(() => {
    isRoundComplete && !isGuessed && onRoundComplete(false);
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
        isGuessed={isGuessed}
        hasAllCompletedRound={hasAllCompletedRound}
      />
      <RoundSummary
        currentDetails={currentDetails}
        roundMovieId={watchRoom?.roundMovieId}
        onRoundComplete={onRoundComplete}
        roundStartedAt={watchRoom?.roundStartedAt}
        timeLeft={timeLeft}
        round={watchRoom?.round}
        prevRound={prevRound}
        setPenalty={setPenalty}
        penalty={penalty}
        isGuessed={isGuessed}
        hasAllCompletedRound={hasAllCompletedRound}
      />
    </div>
  );
};

export default Room;

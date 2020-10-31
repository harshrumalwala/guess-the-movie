import { MAX_ROUND_TIME, ROUND_BUFFER, TIME_PENALTY } from 'client/constants';

export const calculateTimeLeft = (roundStartedAt, penalty, isGuessed) =>
  isGuessed
    ? -1
    : roundStartedAt
    ? Math.max(
        MAX_ROUND_TIME -
          (Math.floor(new Date().getTime() / 1000) -
            Math.floor(new Date(roundStartedAt).getTime() / 1000) -
            ROUND_BUFFER +
            TIME_PENALTY * penalty),
        -1
      )
    : undefined;

export const isRoundActive = (roundStartedAt, penalty, isGuessed) => {
  const timeLeft = calculateTimeLeft(roundStartedAt, penalty, isGuessed);
  return timeLeft > 0 && timeLeft <= MAX_ROUND_TIME;
};

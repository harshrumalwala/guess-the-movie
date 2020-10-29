export const calculateTimeLeft = (roundStartedAt) =>
  roundStartedAt
    ? Math.max(
        90 -
          (Math.floor(new Date().getTime() / 1000) -
            Math.floor(new Date(roundStartedAt).getTime() / 1000) -
            10),
        -1
      )
    : undefined;

export const isRoundActive = (roundStartedAt, questions) => {
  const timeLeft = calculateTimeLeft(roundStartedAt);
  return timeLeft > 0 && timeLeft <= 90 && questions <= 15;
};

import React from "react";
import { useRoom, useUpdateRoom } from "client/hooks";
import _ from "lodash";
import { Button } from "@material-ui/core";
import { useParams } from "react-router-dom";

const Room = () => {
  const { roomId } = useParams();
  const { data } = useRoom();
  const watchRoom = data?.watchRoom;
  const { updateRoom } = useUpdateRoom();

  const onRoundComplete = () => {
    updateRoom({ variables: { id: roomId, hasCompletedRound: true } });
  };

  return (
    <>
      <h1>Room</h1>
      <ul>
        <li>Round - {watchRoom?.round}</li>
        <li>Round Limit - {watchRoom?.roundLimit}</li>
        <li>Players - {_.map(watchRoom?.players, "name").join(' ')}</li>
        <li>Round Completed - {_.map(watchRoom?.roundCompleted, "id").join(' ')}</li>
        <li>Round Movie Id - {watchRoom?.roundMovieId}</li>
      </ul>
      <Button onClick={onRoundComplete} variant="contained" color="primary">
        Complete Round
      </Button>
    </>
  );
};

export default Room;

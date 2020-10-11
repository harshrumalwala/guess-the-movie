import { useParams } from "react-router-dom";
import { gql, useSubscription } from "@apollo/react-hooks";

const ROOM_SUBSCRIPTION = gql`
  subscription OnRoomUpdate($id: ID!) {
    watchRoom(id: $id) {
      round
      roundLimit
      roundMovieId
      language {
        name
      }
      players {
        id
        name
        score
      }
      roundCompleted {
        id
      }
      host {
        id
      }
    }
  }
`;

const useRoom = () => {
  const { roomId } = useParams();
  const { data, loading } = useSubscription(ROOM_SUBSCRIPTION, {
    variables: { id: roomId },
  });

  return { loading, data };
};

export default useRoom;

import { gql, useMutation } from "@apollo/react-hooks";

const UPDATE_ROOM = gql`
  mutation OnRoomUpdate(
    $id: ID!
    $name: String
    $score: Int
    $isGameReady: Boolean
    $isGameRestarted: Boolean
    $hasCompletedRound: Boolean
    $hasPlayerLeft: Boolean
  ) {
    updateRoom(
      id: $id
      name: $name
      score: $score
      isGameReady: $isGameReady
      isGameRestarted: $isGameRestarted
      hasCompletedRound: $hasCompletedRound
      hasPlayerLeft: $hasPlayerLeft
    ) {
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

const useUpdateRoom = () => {
  const [updateRoom, { data }] = useMutation(UPDATE_ROOM);

  return { updateRoom, data };
};

export default useUpdateRoom;

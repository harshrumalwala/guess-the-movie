import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useQuery, gql } from '@apollo/react-hooks';
import { Loader } from '..';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  }
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundImage: 'linear-gradient(to bottom, #cc208e 0%, #6713d2 100%)',
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14,
    color: 'gold'
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundImage: 'linear-gradient(to right, #a5204a  , #1d2671)',
    cursor: 'pointer'
  }
}))(TableRow);

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      round
      host {
        name
      }
      createdAt
    }
  }
`;

export default function RoomsList() {
  const classes = useStyles();
  const history = useHistory();
  const { loading, data } = useQuery(GET_ROOMS);
  const rooms = _.filter(data?.rooms, (room) => room.round === 0 && room.host);

  if (loading) return <Loader />;

  const handleJoinRoom = (e, id) => {
    e.preventDefault();
    history.push(`/room/${id}`);
  };

  return (
    <div className={classes.root}>
      {rooms && _.size(rooms) > 0 && (
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Host</StyledTableCell>
                <StyledTableCell>Created At</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {_.map(rooms, (room) => (
                <StyledTableRow
                  key={room.id}
                  onClick={(e) => handleJoinRoom(e, room.id)}
                >
                  <StyledTableCell component="th" scope="row">
                    {room.id}
                  </StyledTableCell>
                  <StyledTableCell>{room.host.name}</StyledTableCell>
                  <StyledTableCell>
                    {_.replace(
                      new Date(room.createdAt).toLocaleString(),
                      ',',
                      ' '
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

import React from 'react';
import _ from 'lodash';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  table: {
    width: '18%',
    minWidth: '275px'
  }
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: 'darkmagenta',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const Scoreboard = ({players}) => {
  const classes = useStyles();
  
  if (players)
    players = _.chain(players)
      .orderBy(['score'], ['desc'])
      .map((v, k) => ({ ...v, rank: k + 1 }))
      .value();
  
      return (
    <TableContainer className={classes.table}>
      <Table stickyHeader>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Rank</StyledTableCell>
            <StyledTableCell>Players</StyledTableCell>
            <StyledTableCell>Score</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {_.map(players, (player) => (
            <StyledTableRow key={player.rank}>
              <StyledTableCell component="th" scope="row">
                {player.rank}
              </StyledTableCell>
              <StyledTableCell>{player.name}</StyledTableCell>
              <StyledTableCell>{player.score}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Scoreboard;

import React from 'react';
import _ from 'lodash';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import birdsOfPrey from 'images/birdsOfPrey.jpg';

const useStyles = makeStyles({
  root: {
    backgroundImage: `url(${birdsOfPrey})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: '20%'
  }
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundImage: 'linear-gradient(to top, #cc208e 0%, #6713d2 100%)',
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14,
    color: 'gold'
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundImage: 'linear-gradient(to right, #a5204a  , #1d2671)'
  }
}))(TableRow);

const Scoreboard = ({ players, roundCompleted }) => {
  const classes = useStyles();

  if (players)
    players = _.chain(players)
      .orderBy(['score'], ['desc'])
      .map((v, k) => ({ ...v, rank: k + 1 }))
      .value();

  const hasCompletedRound = (player) =>
    _.assign(
      {},
      _.chain(roundCompleted).map('id').includes(player?.id).value() && {
        color: 'lawngreen'
      }
    );

  return (
    <div className={classes.root}>
      <TableContainer>
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
                <StyledTableCell
                  component="th"
                  scope="row"
                  style={hasCompletedRound(player)}
                >
                  {player.rank}
                </StyledTableCell>
                <StyledTableCell style={hasCompletedRound(player)}>
                  {player.name}
                </StyledTableCell>
                <StyledTableCell style={hasCompletedRound(player)}>
                  {player.score}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Scoreboard;

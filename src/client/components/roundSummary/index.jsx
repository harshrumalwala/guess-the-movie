import React from 'react';
import RoundHeader from '../roundHeader';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    width: '20%'
  }
}));

const enrichData = (currentDetails) => {
  let formattedReleasedAfterDate, formattedReleasedBeforeDate;
  if (currentDetails?.releasedAfter) {
    const releasedAfterDate = new Date(currentDetails.releasedAfter);
    formattedReleasedAfterDate = `${releasedAfterDate.getDate()}/${releasedAfterDate.getMonth() + 1}/${releasedAfterDate.getFullYear()}`;
  }
  if (currentDetails?.releasedBefore) {
    const releasedBeforeDate = new Date(currentDetails.releasedBefore);
    formattedReleasedBeforeDate = `${releasedBeforeDate.getDate()}/${releasedBeforeDate.getMonth() + 1}/${releasedBeforeDate.getFullYear()}`;
  }
  return _.assign(
    {},
    currentDetails?.language && {
      'Primary Language': currentDetails.language
    },
    currentDetails?.director && {
      Director: currentDetails.director
    },
    currentDetails?.cast && {
      Cast: _.join(currentDetails.cast, ', ')
    },
    currentDetails?.genre && {
      Genre: _.join(currentDetails.genre, ', ')
    },
    currentDetails?.releasedAfter && currentDetails?.releasedBefore
      ? {
          Released: `Between ${formattedReleasedAfterDate} - ${formattedReleasedBeforeDate}`
        }
      : currentDetails?.releasedAfter
      ? { Released: `After ${formattedReleasedAfterDate}` }
      : currentDetails?.releasedBefore && {
          Released: `Before ${formattedReleasedBeforeDate}`
        },
    currentDetails?.collectionGt && currentDetails?.collectionLt
      ? {
          'Estimated Box Office Collection': `Between $${
            currentDetails.collectionGt / 1000000
          } million - $${currentDetails.collectionLt / 1000000} million`
        }
      : currentDetails?.collectionGt
      ? {
          'Estimated Box Office Collection': `More than $${
            currentDetails.collectionGt / 1000000
          } million`
        }
      : currentDetails?.collectionLt && {
          'Estimated Box Office Collection': `Less than $${
            currentDetails.collectionLt / 1000000
          } million`
        }
  );
};

const RoundSummary = ({ currentDetails }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <RoundHeader isSummary={true} />
      <Table>
        <TableBody>
          {_.map(enrichData(currentDetails), (value, key) => (
            <TableRow key={key}>
              <TableCell component="th" scope="row">
                {key}
              </TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoundSummary;

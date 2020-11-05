import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1)
  }
}));

const TabPanel = (props) => {
  const { children, value, index } = props;
  const classes = useStyles();

  return (
    <div hidden={value !== index} className={classes.root}>
      { value === index && children }
    </div>
  );
};

export default TabPanel;

import React, { useEffect } from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { useCurrentUser } from 'client/hooks';
import { useHistory } from 'react-router-dom';
import { RoomsList, TabPanel, CreateRoom } from 'client/components';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '45%'
  },
  root: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  joinRoom: {
    margin: theme.spacing(3, 0, 2)
  },
  tabHeader: {
    color: 'white'
  },
  tabPanel: {
    width: '90%'
  }
}));

const StyledAppBar = withStyles((theme) => ({
  colorPrimary: {
    backgroundImage: 'linear-gradient(to top, #cc208e 0%, #6713d2 100%)'
  }
}))(AppBar);

const Home = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const history = useHistory();
  const { token } = useCurrentUser();

  useEffect(() => {
    !token && history.push('/login');
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const classes = useStyles();

  const tabProps = (index) => {
    return {
      id: `tab-${index}`,
      className: classes.tabHeader
    };
  };

  return (
    <Container className={classes.container}>
      <CssBaseline />
      <div className={classes.root}>
        <StyledAppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            TabIndicatorProps={{
              style: { background: 'deepskyblue' }
            }}
          >
            <Tab label="Join Room" {...tabProps(0)} />
            <Tab label="Create Room" {...tabProps(1)} />
          </Tabs>
        </StyledAppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
          className={classes.tabPanel}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <RoomsList />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <CreateRoom />
          </TabPanel>
        </SwipeableViews>
      </div>
    </Container>
  );
};

export default Home;

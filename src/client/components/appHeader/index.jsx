import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useCurrentUser } from 'client/hooks';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer'
  }
}));

const StyledAppBar = withStyles((theme) => ({
  colorPrimary: {
    color: 'gold',
    backgroundImage: 'linear-gradient(to right, #a5204a  , #1d2671)'
  }
}))(AppBar);

const AppHeader = () => {
  const classes = useStyles();
  const { token, setToken, setUserId } = useCurrentUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const client = useApolloClient();

  useEffect(() => {
    const cleanup = () => sessionStorage.clear();

    window.addEventListener('beforeunload', cleanup);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    setAnchorEl(null);
    history.push('/login');
  };

  const handleLogout = () => {
    setAnchorEl(null);
    setToken(null);
    setUserId(null);
    client.resetStore();
    sessionStorage.clear();
    redirectToHome();
  };

  const redirectToHome = () => {
    history.push('/');
  };

  return (
    <div className={classes.root}>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={redirectToHome}
          >
            Guess The Movie
          </Typography>
          {token ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Toolbar>
      </StyledAppBar>
    </div>
  );
};

export default AppHeader;

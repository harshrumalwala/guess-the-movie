import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { gql, useMutation } from '@apollo/react-hooks';
import { useCurrentUser } from 'client/hooks';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const LOGIN_USER = gql`
  mutation Login($name: String!) {
    login(name: $name) {
      token
    }
  }
`;

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [loginUser, { data }] = useMutation(LOGIN_USER);
  const { setToken } = useCurrentUser();

  useEffect(() => {
    if (data) {
      setToken(data.login.token);
      localStorage.setItem('token', data.login.token);
      history.push('/');
    }
  }, [data, setToken, history]);

  const handleLogin = (e) => {
    e.preventDefault();
    !_.isEmpty(_.trim(userName)) &&
      loginUser({ variables: { name: _.trim(userName) } });
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <div className={classes.container}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="userName"
            label="User Name"
            name="userName"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin}
          >
            Login
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;

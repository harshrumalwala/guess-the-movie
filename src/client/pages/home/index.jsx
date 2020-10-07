import React from "react";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { useCurrentUser } from "client/hooks";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  login: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Home = () => {
  const classes = useStyles();
  const history = useHistory();
  const { token } = useCurrentUser();

  const handleLogin = () => {
    history.push("/login");
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <div className={classes.container}>
        <Typography component="h1" variant="h5">
          Home
        </Typography>
        {!_.isNil(token) ? (
          <span>User with token - {token} is logged in</span>
        ) : (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.login}
            onClick={handleLogin}
          >
            Log In
          </Button>
        )}
      </div>
    </Container>
  );
};

export default Home;

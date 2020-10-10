import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useCurrentUser } from "client/hooks";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  joinRoom: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Home = () => {
  const classes = useStyles();
  const { token } = useCurrentUser();
  const history = useHistory();

  const handleJoinRoom = () => {
    history.push("/room/fae12de7-11e5-4742-be55-8f36615a6a2d");
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <div className={classes.container}>
        <Typography component="h1" variant="h5">
          Home
        </Typography>
        {token && (
          <>
            <span>User is logged in</span>
            <Button
              onClick={handleJoinRoom}
              variant="contained"
              color="primary"
              className={classes.joinRoom}
            >
              Join Room
            </Button>
          </>
        )}
      </div>
    </Container>
  );
};

export default Home;

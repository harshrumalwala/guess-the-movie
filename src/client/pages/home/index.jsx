import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useCurrentUser } from "client/hooks";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
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
  const { token } = useCurrentUser();

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <div className={classes.container}>
        <Typography component="h1" variant="h5">
          Home
        </Typography>
        {token && <span>User with token - {token} is logged in</span>}
      </div>
    </Container>
  );
};

export default Home;

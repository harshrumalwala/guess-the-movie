import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useCurrentUser } from 'client/hooks';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { ListRooms } from 'client/components';
import BackgroundSlider from 'react-background-slider';
import {
  inception,
  joker,
  toyStory,
  ramleela,
  wolfOfWallStreet,
  wonderWoman,
  annabelle,
  threeIdiots,
  aladdin,
  bossBaby,
  bahubali,
  matrix,
  deadpool,
  ddlj,
  conjuring,
  findingNemo,
  avatar,
  harryPotter,
  lalaland,
  frozen
} from 'images';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  joinRoom: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Home = () => {
  const classes = useStyles();
  const { token } = useCurrentUser();
  const history = useHistory();

  const handleJoinRoom = () => {
    history.push('/room/774eef22-baea-4849-af5e-1ae9419b4406');
  };

  return (
    <>
      <BackgroundSlider
        images={[
          inception,
          joker,
          toyStory,
          ramleela,
          wolfOfWallStreet,
          wonderWoman,
          annabelle,
          threeIdiots,
          aladdin,
          bossBaby,
          bahubali,
          matrix,
          deadpool,
          ddlj,
          conjuring,
          findingNemo,
          avatar,
          harryPotter,
          lalaland,
          frozen
        ]}
        duration={10}
        transition={2}
      />
      <Container maxWidth="xs">
        <CssBaseline />
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            Home
          </Typography>
          {token && (
            <>
              <span>User is logged in</span>
              <ListRooms></ListRooms>
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
    </>
  );
};

export default Home;

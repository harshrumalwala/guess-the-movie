import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

// function ListItemLink(props) {
//   return <ListItem button component="a" {...props} />;
// }

export default function SimpleList() {
  const classes = useStyles();
  const history = useHistory();

  const handleJoinRoom = () => {
    history.push('/room/774eef22-baea-4849-af5e-1ae9419b4406');
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button onClick={handleJoinRoom}>
          
          {/* <ListItemIcon>
            <InboxIcon />
          </ListItemIcon> */}
          <ListItemText primary="Room1" />
        </ListItem>
        <ListItem button>
          {/* <ListItemIcon>
          Add logic to fetch from graphql
            <DraftsIcon />
          </ListItemIcon> */}
          <ListItemText primary="Room2" />
        </ListItem>
      </List>
    </div>
  );
}

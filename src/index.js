import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MovieViewer from './client/MovieViewer';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import client from './apollo';
import {ApolloProvider} from 'react-apollo'

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MovieViewer />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
if (module.hot) module.hot.accept();

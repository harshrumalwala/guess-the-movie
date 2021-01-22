import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { ApolloProvider } from '@apollo/react-hooks';
import { CurrentUserProvider } from 'client/hooks';
import Routes from 'client/routes';
import { BrowserRouter } from 'react-router-dom';
import { AppHeader } from 'client/components';
import { WebSocketLink } from '@apollo/client/link/ws';
import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import BackgroundSlider from 'react-background-slider';
import { BACKGROUND_IMAGES } from 'client/constants';
import { setContext } from '@apollo/client/link/context';

const isHttps = () => window.location.protocol.includes('s');

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const httpLink = new HttpLink({
  uri:
    process.env.NODE_ENV !== 'production'
      ? 'http://localhost:5000/graphql'
      : '/graphql'
});

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV !== 'production'
      ? 'ws://localhost:5000/subscriptions'
      : `${isHttps() ? 'wss' : 'ws'}://${window.location.host}/subscriptions`,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <CurrentUserProvider>
        <BackgroundSlider
          images={BACKGROUND_IMAGES}
          duration={10}
          transition={2}
        />
        <AppHeader />
        <Routes />
      </CurrentUserProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

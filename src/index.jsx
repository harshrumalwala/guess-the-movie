import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloProvider } from "@apollo/react-hooks";
import { CurrentUserProvider } from "client/hooks";
import Routes from "client/routes";
import { BrowserRouter } from "react-router-dom";
import { AppHeader } from "client/components";
import { WebSocketLink } from "@apollo/client/link/ws";
import { split, HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem("token");
const isHttps = () => window.location.protocol.includes("s");

const httpLink = new HttpLink({
  uri:
    process.env.NODE_ENV !== "production"
      ? "http://localhost:5000/graphql"
      : "/graphql",
  headers: {
    Authorization: `Bearer ${token ? token : ""}`,
  },
});

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV !== "production"
      ? "ws://localhost:5000/graphql"
      : `${isHttps() ? "wss" : "ws"}://${window.location.host}/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        Authorization: `Bearer ${token ? token : ""}`,
      },
    },
  },
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <CurrentUserProvider>
          <AppHeader />
          <Routes />
        </CurrentUserProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
if (module.hot) module.hot.accept();

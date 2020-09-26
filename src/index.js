import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MovieViewer from "./client/MovieViewer";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";

const client = new ApolloClient(
  process.env.NODE_ENV !== "production" && {
    uri: "http://localhost:5000/graphql",
  }
);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MovieViewer />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
if (module.hot) module.hot.accept();

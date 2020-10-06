import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";

const Home = lazy(() => import("client/pages/home"));
const Login = lazy(() => import("client/pages/login"));
const Profile = lazy(() => import("client/pages/profile"));
const Room = lazy(() => import("client/pages/room"));

const Routes = () => (
  <Switch>
    <Suspense fallback={<h1>Loading Page</h1>}>
      <Route path="/room/:roomId" component={Room} />
      <Route path="/login" component={Login} />
      <Route path="/profile" component={Profile} />
      <Route exact path="/" component={Home} />
    </Suspense>
  </Switch>
);

export default Routes;

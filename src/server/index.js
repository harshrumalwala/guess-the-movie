const { GraphQLServer, PubSub } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const _ = require('lodash');
const path = require('path');
const express = require('express');
const Query = require('./resolvers/query');
const Subscription = require('./resolvers/Subscription');
const Mutation = require('./resolvers/mutation');

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Subscription
};

const PORT = process.env.PORT || 5000;

const options = {
  port: PORT,
  endpoint: '/graphql',
  playground: '/playground',
  subscriptions: '/subscriptions'
};
const server = new GraphQLServer({
  typeDefs: './src/server/schema.graphql',
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma,
      pubsub
    };
  }
});

// if (server.express.get("env") === "production") {
const buildPath = path.join(__dirname, '../../build');
_.forEach(['/', '/login', '/room/*'], (url) => {
  server.express.use(url, express.static(buildPath));
});
// }

server.start(options, () => {
  console.log(`Server is running on port - ${options.port}`);
});

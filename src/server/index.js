const {
  GraphQLServer
} = require("graphql-yoga");
const {
  PrismaClient
} = require("@prisma/client");
const path = require("path");
const express = require("express");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation,
};

const PORT = process.env.PORT || 5000;

const options = {
  port: PORT,
  endpoint: "/graphql",
  playground: "/playground",
  subscriptions: "/subscriptions",
};
const server = new GraphQLServer({
  typeDefs: "./src/server/schema.graphql",
  resolvers,
  context: request => {
    return {
      ...request,
      prisma
    }
  },
});

if (server.express.get("env") === "production") {
  const buildPath = path.join(__dirname, "../../build");
  server.express.use(express.static(buildPath));
}

server.start(options, () => {
  console.log(
    `Server is running at  http://localhost:${options.port}${options.endpoint}`
  );
});
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { PrismaClient } from "@prisma/client";
import { auth } from "express-oauth2-jwt-bearer";

import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

dotenv.config();

const prisma = new PrismaClient();

// 🔐 Auth0 JWT middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN, // keep https:// here!
  tokenSigningAlg: "RS256",
});

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json()); // MUST be before Apollo

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });

  await server.start();

  // 🔥 Protect GraphQL route
  app.use(
    "/graphql",
    checkJwt, // JWT verification middleware
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          prisma,
          user: req.auth?.payload, // 🔥 THIS is important
        };
      },
    }),
  );

  const PORT = 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/graphql`);
  });
}

startServer();

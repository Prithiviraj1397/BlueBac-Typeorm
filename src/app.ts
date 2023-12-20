import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/federation';
import { GraphQLSchema } from 'graphql';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { Express, Request, Response, NextFunction, } from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config/config';
import { connect } from "./config/db";
import { typeDefs, resolvers } from "./graphql/index";
import { setHttpPlugin } from './utils/setHttpPlugin';
import { validateToken } from './middleware/jwt';

const startServer = async () => {
    const app: Express = express();
    const httpServer = http.createServer(app);
    const PORT = config?.PORT;
    interface MyContext {
        token?: string;
    }
    
    const server = new ApolloServer<MyContext>({
        typeDefs,
        resolvers,
        plugins: [
            ApolloServerPluginInlineTraceDisabled(),
            ApolloServerPluginDrainHttpServer({ httpServer }),
        ],
    });

    await server.start();
    const corsOptions = {
        origin: config?.ALLOWEDORIGIN,
        credentials: true,
    }
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(corsOptions),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req, res }: { req: Request, res: Response }) => {
                const token = req.headers.authorization;
                let info = token ? await validateToken(token) : {};
                return { req, res, info };
            },
        }),
    );

    connect();

    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
}

startServer(); 
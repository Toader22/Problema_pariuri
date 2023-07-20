import { ApolloServer} from 'apollo-server';
import NodeCache from 'node-cache';
import typeDefs from './schema.js';
import resolvers from './resolvers.js';




export const sessionCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
export const stakesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});


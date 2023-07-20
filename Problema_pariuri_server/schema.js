import gql from 'graphql-tag';

const typeDefs = gql`
    type Query {
        session(customerId: Int!): String
        highStakes(betOfferId: Int!): String
    }

    type Mutation {
        postStake(betOfferId: Int!, stake: Int!, sessionKey: String!): Boolean
    }
`;

export default typeDefs;

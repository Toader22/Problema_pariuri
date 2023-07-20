import gql from 'graphql-tag';

const typeDefs = gql`
  type Stake {
    customerId: Int!
    stake: Int!
  }

  type Query {
    session(customerId: Int!): String
    highStakes(betOfferId: Int!): [Stake!]
  }

  type Mutation {
    postStake(betOfferId: Int!, stake: Int!, sessionKey: String!): Boolean
  }
`;

export default typeDefs;

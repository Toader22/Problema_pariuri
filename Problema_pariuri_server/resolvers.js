import { v4 as uuidv4 } from 'uuid';
import { sessionCache, stakesCache } from './index.js';
import { AuthenticationError } from 'apollo-server';

const resolvers = {
  Query: {
    session: (_, { customerId }) => {
      let sessionKey = sessionCache.get(`customer_${customerId}`);
      if (!sessionKey) {
        sessionKey = uuidv4();
        sessionCache.set(`customer_${customerId}`, sessionKey);
      }
      return sessionKey;
    },
    highStakes: (_, { betOfferId }) => {
      const stakes = stakesCache.get(`offer_${betOfferId}`) || [];
      stakes.sort((a, b) => b - a);
      const topStakes = stakes.slice(0, 20);
      return topStakes.join(",");
    }
  },
  Mutation: {
    postStake: (_, { betOfferId, stake, sessionKey }) => {
      console.log(`Attempting to post stake: ${stake} for offer: ${betOfferId}`);
      let isValidSession = false;
      const keys = sessionCache.keys();
      for (let key of keys) {
        if (sessionCache.get(key) === sessionKey) {
          isValidSession = true;
          break;
        }
      }
      if (!isValidSession) {
        throw new AuthenticationError("Invalid session key");
      }

      const currentStakes = stakesCache.get(`offer_${betOfferId}`) || [];
      currentStakes.push(stake);
      currentStakes.sort((a, b) => b - a);
      const topStakes = currentStakes.slice(0, 20);
      console.log(`Top 20 stakes for offer ${betOfferId} in decreasing order:`, topStakes);

      stakesCache.set(`offer_${betOfferId}`, currentStakes);

      console.log(`Updated stakes for offer ${betOfferId}:`, currentStakes);

      return true;
    },
  },
};

export default resolvers;

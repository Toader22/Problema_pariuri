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
      stakes.sort((a, b) => b.stake - a.stake);
      const stakesMap = new Map();
      stakes.forEach(stakeObj => {
        if (!stakesMap.has(stakeObj.customerId)) {
          stakesMap.set(stakeObj.customerId, stakeObj);
        }
      });
      const topStakes = Array.from(stakesMap.values()).slice(0, 20);
      return topStakes;
    }
  },
  Mutation: {
    postStake: (_, { betOfferId, stake, sessionKey }) => {
      console.log(`Attempting to post stake: ${stake} for offer: ${betOfferId}`);
      let isValidSession = false;
      let customerId;
      const keys = sessionCache.keys();
      for (let key of keys) {
        if (sessionCache.get(key) === sessionKey) {
          isValidSession = true;
          customerId = key.split('_')[1]; 
          break;
        }
      }
      if (!isValidSession) {
        throw new AuthenticationError("Invalid session key");
      }

      const currentStakes = stakesCache.get(`offer_${betOfferId}`) || [];
      const stakeObj = { stake, customerId: Number(customerId) };
      currentStakes.push(stakeObj);
      currentStakes.sort((a, b) => b.stake - a.stake);
      console.log(`Updated stakes for offer ${betOfferId}:`, currentStakes);

      stakesCache.set(`offer_${betOfferId}`, currentStakes);

      return true;
    },
  },
};

export default resolvers;

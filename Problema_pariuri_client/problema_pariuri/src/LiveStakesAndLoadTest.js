import React, { useEffect, useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const GET_SESSION_KEY = gql`
  query GetSession($customerId: Int!) {
    session(customerId: $customerId)
  }
`;

const POST_STAKE = gql`
  mutation PostStake($betOfferId: Int!, $stake: Int!, $sessionKey: String!) {
    postStake(betOfferId: $betOfferId, stake: $stake, sessionKey: $sessionKey)
  }
`;

const GET_HIGH_STAKES = gql`
  query HighStakes($betOfferId: Int!) {
    highStakes(betOfferId: $betOfferId)
  }
`;

function LiveStakesAndLoadTest() {
  const betOfferIds = useMemo(() => [1, 2, 3, 4, 5], []);
  const [sessionKey, setSessionKey] = useState('');
  const [selectedBetOfferId, setSelectedBetOfferId] = useState(betOfferIds[0]);
  const customerId = Math.floor(Math.random() * 10000);

  const { data: sessionData, error: sessionError } = useQuery(GET_SESSION_KEY, { variables: { customerId } });
  const [postStake, { error: postStakeError }] = useMutation(POST_STAKE);
  const { data: highStakesData, error: highStakesError, refetch: refetchHighStakes } = useQuery(GET_HIGH_STAKES, {
    variables: { betOfferId: selectedBetOfferId },
    pollInterval: 5000,
  });

  useEffect(() => {
    if (sessionError) {
      console.error('Error fetching session:', sessionError);
    }
    if (sessionData && sessionData.session) {
      setSessionKey(sessionData.session);
      const betOfferId = betOfferIds[Math.floor(Math.random() * betOfferIds.length)];
      const stake = Math.floor(Math.random() * 10000);
      postStake({ variables: { betOfferId, stake, sessionKey: sessionData.session } });
    }
  }, [betOfferIds, postStake, sessionData, sessionError]);
  

  useEffect(() => {
    if (postStakeError) {
      console.error('Error posting stake:', postStakeError);
    }
    if (sessionKey) {
      const betOfferId = betOfferIds[Math.floor(Math.random() * betOfferIds.length)];
      const stake = Math.floor(Math.random() * 10000);
      postStake({ variables: { betOfferId, stake, sessionKey } });
    }
  }, [betOfferIds, postStake, sessionKey, postStakeError]);
  
  

  if (highStakesError) {
    console.error('Error querying for high stakes:', highStakesError);
  }

  console.log('High stakes data:', highStakesData && highStakesData.highStakes);

  const handleBetOfferChange = (event) => {
    setSelectedBetOfferId(parseInt(event.target.value, 10));
  };

  return (
    <div>
      <h2>Top 20 stakes for bet offer {selectedBetOfferId}</h2>
      <select value={selectedBetOfferId} onChange={handleBetOfferChange}>
        {betOfferIds.map((betOfferId) => (
          <option key={betOfferId} value={betOfferId}>
            {betOfferId}
          </option>
        ))}
      </select>
      <p>{highStakesData && highStakesData.highStakes !== '' ? highStakesData.highStakes : 'No stakes yet'}</p>
    </div>
  );
}


//??
export default LiveStakesAndLoadTest;

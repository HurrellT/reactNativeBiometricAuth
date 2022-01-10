import React from 'react';
import { View, Text } from 'react-native';

import { useUnlock } from '../contexts/UnlockContext/UnlockContext';

const SuperSecretStuff = () => {
  const [tokenKey] = useUnlock();
  // You can use the token to authenticate every request that is sent to the backend

  return (
    <View>
      <Text>Keep your hands away from my data!</Text>
    </View>
  );
};

export default SuperSecretStuff;
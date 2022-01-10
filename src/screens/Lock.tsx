import React, { useCallback, useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

import { useUnlock } from '../contexts/UnlockContext/UnlockContext';
import useIsBiometricSupported from '../hooks/useIsBiometricSupported';

type Pin = { pin: string; status: string; fingerprintHash?: string };
type PinAction = {
  type: 'default' | 'cancel' | 'back' | 'fingerprint_start' | 'fingerprint_end';
  payload?: string;
};
type PinReducer = (state: Pin, action: PinAction) => Pin;
type DecryptionRequestObject = {
  pin?: string;
  fingerprintHash?: string;
};
type GetDecryptionKey = (opt: DecryptionRequestObject) => Promise<string>;

const NUMBERS = [
  { key: '1', value: '1' },
  { key: '2', value: '2' },
  { key: '3', value: '3' },
  { key: '4', value: '4' },
  { key: '5', value: '5' },
  { key: '6', value: '6' },
  { key: '7', value: '7' },
  { key: '8', value: '8' },
  { key: '9', value: '9' },
  { key: '🔙', actionType: 'back' },
  { key: '0', value: '0' },
];

const PIN_LENGTH = 4;

const INITIAL_STATE: Pin = { status: '', pin: '' };

const pinReducer: PinReducer = (state, action) => {
  const { pin } = state;
  switch (action.type) {
    case 'default':
      return {
        ...state,
        pin: pin.length < PIN_LENGTH ? pin.concat(action.payload!) : pin,
      };
    case 'back':
      return { ...state, pin: pin.substring(0, pin.length - 1) };
    case 'cancel':
      return { ...state, pin: '' };
    case 'fingerprint_start':
      return { ...state, status: 'fingerprint_start' };
    case 'fingerprint_end':
      return {
        ...state,
        status: 'fingerprint_end',
        fingerprintHash: action.payload,
      };
  }
};

const getDecryptionKey: GetDecryptionKey = async opt => {
  /**
   * api that checks the pin, if it's correct or not. if yes, pass a decryption key, that will be used for future requests
   * maybe something similiar to jwt or refresh token?
     const response = await fetch("https://awesome-api.org/unlockApp", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(opt),
      });
      const jsonResponse = await response.json();
      return jsonResponse.decryptionObject as string;
  */
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('the-decryption-key');
    }, 1500);
  });
};

const Lock = () => {
  const [, setDecryptionKey] = useUnlock();
  const isBiometricSupported = useIsBiometricSupported();
  const [{ pin, status, fingerprintHash }, dispatchPin] = useReducer(
    pinReducer,
    INITIAL_STATE,
  );

  const PIN_PLACEHODLER = pin.padEnd(PIN_LENGTH, '*');
  const BUTTONS_WITH_FINGERPRINT_HANDLED = isBiometricSupported
    ? [...NUMBERS, { key: '👍', actionType: 'fingerprint_start' }]
    : NUMBERS;

  const handlePin = (action: PinAction) => () => dispatchPin(action);
  const handleDecryptionKey = useCallback(
    async () =>
      setDecryptionKey(await getDecryptionKey({ pin, fingerprintHash })),
    [fingerprintHash, pin, setDecryptionKey],
  );
  const handleBiometric = async () => {
    const biometricResult = await ReactNativeBiometrics.createSignature({
      promptMessage: 'SIGN IN WITH BIOMETRIC',
      cancelButtonText: 'USE PIN',
      payload: 'a-payload-key-such-as-JWT',
    });
    dispatchPin({
      type: 'fingerprint_end',
      payload: biometricResult.signature,
    });
  };

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleDecryptionKey();
    }
  }, [pin, handleDecryptionKey]);
  
  useEffect(() => {
    if (status === 'fingerprint_start') {
      handleBiometric();
    }
    if (status === 'fingerprint_end' && fingerprintHash) {
      handleDecryptionKey();
    }
  }, [status, fingerprintHash, handleDecryptionKey]);

  return (
    <View style={style.wrapper}>
      <Text style={style.pin}>{PIN_PLACEHODLER}</Text>
      <View style={style.container}>
        {BUTTONS_WITH_FINGERPRINT_HANDLED.map(v => {
          return (
            <TouchableOpacity
              key={v.key.toString()}
              style={style.text}
              onPress={handlePin({
                type: (v.actionType as PinAction['type']) || 'default',
                payload: v.value,
              })}>
              <Text>{v.key}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={style.text}
          onPress={handlePin({ type: 'cancel' })}>
          <Text>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Lock;

const style = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pin: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '33%',
    textAlign: 'center',
  },
});
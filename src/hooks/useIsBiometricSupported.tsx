import { useState, useEffect } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';

const useIsBiometricSupported = (): boolean => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const handleIsBiometricSupported = async () => {
    try {
      const isAvailable = (await ReactNativeBiometrics.isSensorAvailable())
        .available;

      setIsBiometricSupported(isAvailable);
    } catch (e) {
      console.log(e);
      setIsBiometricSupported(false);
    }
  };

  useEffect(() => {
    handleIsBiometricSupported();
  }, []);

  return isBiometricSupported;
};

export default useIsBiometricSupported;
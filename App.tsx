import React from 'react';

import { TransactionHistoryScreen } from './src/screens/TransactionHistoryScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <TransactionHistoryScreen />
    </SafeAreaProvider>
  );
}

export default App;

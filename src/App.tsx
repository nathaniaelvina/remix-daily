import React from 'react';
import { RtcCallProvider } from './av/RtcCallProvider';

import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <RtcCallProvider>
      <AppNavigator />
    </RtcCallProvider>
  );
}

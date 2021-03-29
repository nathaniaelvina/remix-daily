import React from 'react';
import {SafeAreaView, StatusBar, Button} from 'react-native';

export function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Button title="Call" onPress={() => {}} />
      </SafeAreaView>
    </>
  );
}

export default App;

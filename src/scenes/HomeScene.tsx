import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, View } from 'react-native';

export function HomeScene() {
  let { navigate } = useNavigation();
  return (
    <View>
      <Button
        title="Join Call"
        onPress={() => {
          navigate('CallOne');
        }}
      />
    </View>
  );
}

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, StyleSheet, View } from 'react-native';
import { useRtcCallContext } from '../av/RtcCallProvider';

export function CallTwoScene() {
  let callContext = useRtcCallContext();
  let { goBack } = useNavigation();
  return (
    <View style={styles.root}>
      <Button
        title="Leave & Go back"
        onPress={async () => {
          await callContext.leaveCall();
          goBack();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

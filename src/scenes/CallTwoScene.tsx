import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, StyleSheet, View } from 'react-native';
import { useRtcCallContext } from '../av/RtcCallProvider';

export function CallTwoScene() {
  let callContext = useRtcCallContext();
  let { goBack } = useNavigation();
  let { params } = useRoute<any>();
  return (
    <View style={styles.root}>
      <Button
        title="Leave & Go back"
        onPress={async () => {
          await callContext.leaveCall();
          if (params.token && params.meetingId) {
            await callContext.joinCall(params.token, params.meetingId);
          } else {
            console.log('no param found');
          }
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

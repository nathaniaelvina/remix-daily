import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, StyleSheet, View } from 'react-native';
import { useRtcCallContext } from '../av/RtcCallProvider';

export function CallTwoScene() {
  let { callObject } = useRtcCallContext();
  let { goBack } = useNavigation();
  let { params } = useRoute<any>();
  return (
    <View style={styles.root}>
      <Button
        title="Leave & Go back"
        onPress={async () => {
          await callObject.leave();
          if (params.token && params.meetingId) {
            await callObject.join({
              url: `https://${ORGANIZATION_NAME}.daily.co/${params.meetingId}`,
              token: params.token,
              // @ts-ignore
              audioSource: true,
              // @ts-ignore
              videoSource: false,
            });
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

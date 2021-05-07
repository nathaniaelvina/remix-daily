import React, { useEffect } from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { getJoinToken } from '../av/getjoinToken';
import { useRtcCallContext } from '../av/RtcCallProvider';
import { createMeeting } from '../av/createMeeting';

export function CallOneScene() {
  let callContext = useRtcCallContext();
  let meetingId = 'remixCallOne';
  let { navigate, goBack } = useNavigation();

  useEffect(() => {
    let join = async () => {
      // await createMeeting(meetingId);
      let userId = generateUserId();
      let token = await getJoinToken(userId, meetingId);
      callContext.joinCall(token, meetingId);
    };
    join();
  }, [callContext, meetingId]);

  let onEnterRoomTwo = async () => {
    let userId = generateUserId();
    let roomTwoId = 'remixCallTwo';
    // await createMeeting(roomTwoId);
    let token = await getJoinToken(userId, roomTwoId);
    callContext.joinCall(token, roomTwoId);

    navigate('CallTwo');
  };

  let onBackPress = async () => {
    await callContext.leaveCall();
    goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <Button title="Back to home" onPress={onBackPress} />
      <Button title="Enter Room Two" onPress={onEnterRoomTwo} />
    </SafeAreaView>
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

function generateUserId() {
  return (Math.random() * 1000).toString();
}

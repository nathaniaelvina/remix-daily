import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { getJoinToken } from '../av/getjoinToken';
import { useRtcCallContext } from '../av/RtcCallProvider';

export function CallOneScene() {
  const [tokenOne, setTokenOne] = useState('');
  let { joinCall, leaveCall } = useRtcCallContext();
  let meetingId = 'remixCallOne';
  let { navigate, goBack } = useNavigation();

  useEffect(() => {
    console.log('masuk effect');
    let join = async () => {
      let userId = generateUserId();
      let token = await getJoinToken(userId, meetingId);
      joinCall(token, meetingId);
      setTokenOne(token);
    };
    join();
  }, [joinCall, meetingId]);

  let onEnterRoomTwo = async () => {
    let userId = generateUserId();
    let roomTwoId = 'remixCallTwo';
    // await createMeeting(roomTwoId);
    let token = await getJoinToken(userId, roomTwoId);
    await leaveCall();
    joinCall(token, roomTwoId);

    navigate('CallTwo', {
      token: tokenOne,
      meetingId,
    });
  };

  let onBackPress = async () => {
    await leaveCall();
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

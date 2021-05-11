import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { getJoinToken } from '../av/getjoinToken';
import { useRtcCallContext } from '../av/RtcCallProvider';
import { ORGANIZATION_NAME } from '../constants';

export function CallOneScene() {
  const [tokenOne, setTokenOne] = useState('');
  let { callObject } = useRtcCallContext();
  let meetingId = 'remixCallOne';
  let { navigate, goBack } = useNavigation();

  useEffect(() => {
    console.log('masuk effect');
    let join = async () => {
      let userId = generateUserId();
      let token = await getJoinToken(userId, meetingId);
      await callObject.join({
        url: `https://${ORGANIZATION_NAME}.daily.co/${meetingId}`,
        token,
        // @ts-ignore
        audioSource: true,
        // @ts-ignore
        videoSource: false,
      });

      setTokenOne(token);
    };
    join();
  }, [callObject, meetingId]);

  let onEnterRoomTwo = async () => {
    let userId = generateUserId();
    let roomTwoId = 'remixCallTwo';
    // await createMeeting(roomTwoId);
    let token = await getJoinToken(userId, roomTwoId);
    await callObject.leave();

    await callObject.join({
      url: `https://${ORGANIZATION_NAME}.daily.co/${roomTwoId}`,
      token,
      // @ts-ignore
      audioSource: true,
      // @ts-ignore
      videoSource: false,
    });
    navigate('CallTwo', {
      token: tokenOne,
      meetingId,
    });
  };

  let onBackPress = async () => {
    await callObject.leave();
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

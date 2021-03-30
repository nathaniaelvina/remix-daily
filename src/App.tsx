import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import Daily, {DailyEvent} from '@daily-co/react-native-daily-js';

import {createMeeting} from './av/createMeeting';
import {getJoinToken} from './av/getjoinToken';
import {joinCall} from './av/joinCall';

export default function App() {
  let onStartCallPress = async () => {
    let meetingId = 'remixDaily';
    await createMeeting(meetingId);
    let id = Math.floor(Math.random() * Math.floor(100)).toString();
    let joinToken = await getJoinToken(id, meetingId);
    await joinCall({
      joinToken,
      meetingId,
      beforeConnect: () => {},
      listeners: () => [],
    });

    // const call = Daily.createCallObject();
    // call.join({
    //   url: `https://remixhq.daily.co/${meetingId}`,
    //   token: joinToken,
    //   // @ts-ignore
    //   audioSource: true,
    //   // @ts-ignore
    //   videoSource: false,
    // });

    // // Listen for events signaling changes to participants or their audio or video.
    // // - 'participant-joined' and 'participant-left' are for remote participants only
    // // - 'participant-updated' is for the local participant as well as remote participants
    // const events: DailyEvent[] = [
    //   'participant-joined',
    //   'participant-updated',
    //   'participant-left',
    //   'error',
    // ];
    // for (const event of events) {
    //   call.on(event, () => {
    //     console.log('EVENT', event);
    //     for (const participant of Object.values(call.participants())) {
    //       console.log('---');
    //       console.log(`participant ${participant.user_id}:`);
    //       if (participant.local) {
    //         console.log('is local');
    //       }
    //       if (participant.audio) {
    //         console.log('audio enabled', participant.audioTrack);
    //       }
    //       if (participant.video) {
    //         console.log('video enabled', participant.videoTrack);
    //       }
    //     }
    //   });
    // }
  };

  return (
    <View style={styles.root}>
      <Button onPress={onStartCallPress} title="Start Call" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

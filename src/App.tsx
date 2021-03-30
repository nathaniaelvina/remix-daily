import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import Daily, {DailyEvent} from '@daily-co/react-native-daily-js';

import {createMeeting} from './av/createMeeting';
import {getJoinToken} from './av/getjoinToken';

export default function App() {
  let onStartCallPress = async () => {
    let meetingId = 'remixDaily';
    await createMeeting(meetingId);
    let id = Math.floor(Math.random() * Math.floor(100)).toString();
    let joinToken = await getJoinToken(id, meetingId);

    const call = Daily.createCallObject();
    call.join({
      url: `https://remixhq.daily.co/${meetingId}`,
      token: joinToken,
      // @ts-ignore
      audioSource: true,
      // @ts-ignore
      videoSource: false,
    });

    const events: DailyEvent[] = [
      'participant-joined',
      'participant-updated',
      'participant-left',
      'error',
    ];
    for (const event of events) {
      call.on(event, () => {
        /**
         * After pressing the button, wait for a few seconds.
         * It should throw
         * Possible Unhandled Promise Rejection (id: 0):
         * "Failed to load call object bundle https://c.daily.co/static/call-machine-object-bundle.js: SyntaxError: 123:2483153:async functions are unsupported"
         */
        console.log('EVENT', event);
        for (const participant of Object.values(call.participants())) {
          console.log('---');
          console.log(`participant ${participant.user_id}:`);
          if (participant.local) {
            console.log('is local');
          }
          if (participant.audio) {
            console.log('audio enabled', participant.audioTrack);
          }
          if (participant.video) {
            console.log('video enabled', participant.videoTrack);
          }
        }
      });
    }
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

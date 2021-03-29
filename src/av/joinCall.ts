import Daily, {DailyCall, DailyEvent} from '@daily-co/react-native-daily-js';

import {
  createEventManager,
  Listener,
  ListenerMap,
  ListenerTuple,
} from './EventManager';

export type JoinCallParams = {
  joinToken: string;
  meetingId: string;
  beforeConnect: (call: Call) => void;
  listeners: (call: Call) => Array<ListenerMap | ListenerTuple>;
};

function joinCallInternal(
  callObject: DailyCall,
  joinToken: string,
  meetingId: string,
) {
  return callObject.join({
    url: `https://remixhq.daily.co/${meetingId}`,
    token: joinToken,
    // @ts-ignore
    audioSource: true,
    // @ts-ignore
    videoSource: false,
  });
}

export function joinCall(params: JoinCallParams) {
  let {meetingId, joinToken, listeners, beforeConnect} = params;
  let callObject = Daily.createCallObject({
    // @ts-ignore
    subscribeToTracksAutomatically: true,
  });
  console.log('CALL', callObject);
  let memberIdToSid = new Map<string, string>();
  let eventManager = createEventManager(callObject);
  eventManager.addListener('error', (error) => {
    console.log('>>>>> Error emitted from callObject <<<<<');
    console.error(error);
  });
  eventManager.addListener('joined-meeting', (event) => {
    if (event) {
      memberIdToSid.clear();
      for (let participant of Object.values(event.participants)) {
        memberIdToSid.set(participant.user_id, participant.session_id);
      }
    }
  });
  eventManager.addListener('participant-joined', (event) => {
    if (event) {
      let {participant} = event;
      memberIdToSid.set(participant.user_id, participant.session_id);
    }
  });
  eventManager.addListener('participant-left', (event) => {
    if (event) {
      memberIdToSid.delete(event.participant.user_id);
    }
  });
  let call = {
    getSid: (memberId: string) => memberIdToSid.get(memberId),
    getCallObject: () => callObject,
    getMuteState: () => {
      return !callObject.localAudio();
    },
    toggleMuteState: (isMuted?: boolean) => {
      let oldMuteState = !callObject.localAudio();
      let newMuteState = isMuted === undefined ? !oldMuteState : isMuted;
      callObject.setLocalAudio(!newMuteState);
      return newMuteState;
    },
    addListener: <T extends DailyEvent>(eventName: T, handler: Listener<T>) => {
      return eventManager.addListener(eventName, handler);
    },
    addListenerMulti: (eventNames: Array<DailyEvent>, handler: () => void) => {
      return eventManager.addListeners([eventNames, handler]);
    },
    disconnect: async () => {
      // Here we avoid leave while the join is in progress (I don't know what
      // would happen if we do so). Instead we wait for the join to complete.
      await joinCallPromise;
      await callObject.leave();
      eventManager.disableListeners();
    },
    reconnect: () => {
      // TODO: What happens if this gets called while we're connected (or in
      // the process of connecting/disconnecting)?
      beforeConnect(call);
      joinCallPromise = joinCallInternal(callObject, joinToken, meetingId);
      eventManager.enableListeners();
      return joinCallPromise;
    },
    disconnectAndDestroy: async () => {
      await joinCallPromise;
      eventManager.disableListeners();
      await callObject.destroy();
    },
  };
  beforeConnect(call);
  let joinCallPromise = joinCallInternal(callObject, joinToken, meetingId);
  let listenersArray = listeners(call);
  listenersArray.forEach((l) => eventManager.addListeners(l));
  return call;
}

export type Call = ReturnType<typeof joinCall>;

export function attachDebuggingLogger(callObject: DailyCall) {
  console.log('>>>', {meetingState: callObject.meetingState()});
  let events = [
    'loading',
    'load-attempt-failed',
    'loaded',
    'started-camera',
    'camera-error',
    'joining-meeting',
    'joined-meeting',
    'left-meeting',
    'participant-joined',
    'participant-updated',
    'participant-left',
    'track-started',
    'track-stopped',
    'app-message',
    'active-speaker-change',
    'network-quality-change',
    'network-connection',
    'live-streaming-started',
    'live-streaming-stopped',
    'live-streaming-error',
  ] as const;
  for (let eventName of events) {
    callObject.on(eventName, (_event) => {
      console.log('>>> ', eventName);
    });
  }
}

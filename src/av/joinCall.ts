import Daily, { DailyCall, DailyEvent } from '@daily-co/react-native-daily-js';
import { ORGANIZATION_NAME } from '../constants';

import {
  createEventManager,
  Listener,
  ListenerMap,
  ListenerTuple,
} from './EventManager';

export type JoinCallParams = {
  joinToken: string;
  meetingId: string;
  listeners: (call: Call) => Array<ListenerMap | ListenerTuple>;
};

function joinCallInternal(
  callObject: DailyCall,
  meetingId: string,
  joinToken: string,
) {
  return callObject.join({
    url: `https://${ORGANIZATION_NAME}.daily.co/${meetingId}`,
    token: joinToken,
    // @ts-ignore
    audioSource: true,
    // @ts-ignore
    videoSource: false,
  });
}

export function joinCall(params: JoinCallParams) {
  let { joinToken, meetingId, listeners } = params;
  let callObject = Daily.createCallObject({
    // @ts-ignore
    subscribeToTracksAutomatically: true,
  });
  let eventManager = createEventManager(callObject);

  let call = {
    getCallObject: () => callObject,
    meetingState: callObject.meetingState(),
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
      await joinCallPromise;
      eventManager.disableListeners();
      await callObject.leave();
    },
    reconnect: () => {
      joinCallPromise = joinCallInternal(callObject, meetingId, joinToken);
      eventManager.enableListeners();
      return joinCallPromise;
    },
    disconnectAndDestroy: async () => {
      await joinCallPromise;
      eventManager.disableListeners();
      await callObject.leave();
      await callObject.destroy();
    },
  };
  let joinCallPromise = joinCallInternal(callObject, meetingId, joinToken);
  let listenersArray = listeners(call);
  listenersArray.forEach((l) => eventManager.addListeners(l));
  return call;
}

export type Call = ReturnType<typeof joinCall>;

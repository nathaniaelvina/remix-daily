import React, { createContext, useContext, useMemo } from 'react';
import { Call, joinCall, JoinCallParams } from './joinCall';

type Props = {
  children: React.ReactElement;
};

type RtcCallContext = {
  joinCall: (token: string, meetingId: string) => void;
  toggleMuteState: (isMuted?: boolean) => boolean;
  leaveCall: () => Promise<void>;
  reconnect: () => Promise<void>;
};

const Context = createContext<RtcCallContext | undefined>(undefined);

let callStack: Array<Call> = [];

function getActiveCall() {
  return callStack.slice(-1)[0];
}

// If we're in a call and we want to join a new call, the existing call will be
// disconnected, but preserved so that when the new call is later disconnected,
// the previous call can resume.
async function addCallToStack(params: JoinCallParams) {
  let currentCall = getActiveCall();
  if (currentCall) {
    await currentCall.disconnect();
    // NOTE: if we don't add wait,
    // user cannot hear voice at all in the second room
    await wait(3000);
  }
  let call = joinCall(params);
  callStack.push(call);
  return call;
}

async function disconnectAndJoinPreviousCall() {
  let currentCall = callStack.pop();
  if (currentCall) {
    await currentCall.disconnectAndDestroy();
    // NOTE: if we don't add wait,
    // user cannot hear voice at all in the second room

    await wait(3000);
  }
  let previousCall = getActiveCall();
  if (previousCall) {
    await previousCall.reconnect();
  }
}

export function RtcCallProvider({ children }: Props) {
  let contextValue = useMemo(
    () => ({
      joinCall: async (token: string, meetingId: string) => {
        let call = await addCallToStack({
          joinToken: token,
          meetingId,
          listeners: (_call) => [
            {
              'joined-meeting': noOp,
              'participant-updated': noOp,
              'participant-joined': noOp,
              'participant-left': noOp,
              error: noOp,
            },
          ],
        });

        return call;
      },
      toggleMuteState: (isMuted?: boolean) => {
        let call = getActiveCall();
        return call?.toggleMuteState(isMuted) ?? true;
      },
      reconnect: async () => {
        let call = getActiveCall();
        await call?.reconnect();
      },
      leaveCall: async () => {
        await disconnectAndJoinPreviousCall();
      },
    }),
    [],
  );
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function useRtcCallContext() {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error('useRtcCallContext must be inside a RtcCallProvider');
  }
  return context;
}

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function noOp() {}

import React, { createContext, useCallback, useContext, useState } from 'react';
import Daily, { DailyCall } from '@daily-co/react-native-daily-js';
import { ORGANIZATION_NAME } from '../constants';

type Props = {
  children: React.ReactElement;
};

type RtcCallContext = {
  joinCall: (token: string, meetingId: string) => void;
  leaveCall: () => Promise<void>;
};

const Context = createContext<RtcCallContext | undefined>(undefined);

export function RtcCallProvider({ children }: Props) {
  const [callObject, setCallObject] = useState<DailyCall | undefined>();

  let joinCall = useCallback(async (joinToken: string, meetingId: string) => {
    let callObj = Daily.createCallObject();
    await callObj.join({
      url: `https://${ORGANIZATION_NAME}.daily.co/${meetingId}`,
      token: joinToken,
      // @ts-ignore
      audioSource: true,
      // @ts-ignore
      videoSource: false,
    });
    setCallObject(callObj);
  }, []);

  let leaveCall = useCallback(async () => {
    if (!callObject) {
      return;
    }
    await callObject.leave();
    await callObject.destroy();
    setCallObject(undefined);
    // NOTE: adding delay works
    // await delay(3000);
  }, [callObject]);

  return (
    <Context.Provider value={{ joinCall, leaveCall }}>
      {children}
    </Context.Provider>
  );
}

export function useRtcCallContext() {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error('useRtcCallContext must be inside a RtcCallProvider');
  }
  return context;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

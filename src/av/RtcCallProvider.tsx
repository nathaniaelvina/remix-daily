import React, { createContext, useContext } from 'react';
import Daily, { DailyCall } from '@daily-co/react-native-daily-js';

type Props = {
  children: React.ReactElement;
};

type RtcCallContext = {
  callObject: DailyCall;
};

const Context = createContext<RtcCallContext | undefined>(undefined);

export function RtcCallProvider({ children }: Props) {
  let callObject = Daily.createCallObject();
  return <Context.Provider value={{ callObject }}>{children}</Context.Provider>;
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

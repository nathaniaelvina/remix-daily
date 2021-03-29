import {
  DailyCall,
  DailyEvent,
  DailyEventObject,
} from '@daily-co/react-native-daily-js';

export type Listener<T extends DailyEvent> = (
  event: DailyEventObject<T> | undefined,
) => void;
type ListenerStore = {[K in DailyEvent]?: Set<Listener<K>>};

export type ListenerMap = {[K in DailyEvent]?: Listener<K>};
export type ListenerTuple = [Array<DailyEvent>, () => void];

export function createEventManager(callObject: DailyCall) {
  let listenerStore: ListenerStore = {};
  let isActive = true;
  let addListener = <T extends DailyEvent>(
    eventName: T,
    listener: Listener<T>,
  ) => {
    let set: Set<Listener<T>> =
      (listenerStore[eventName] as Set<Listener<T>>) ||
      (listenerStore[eventName] = new Set() as any);
    set.add(listener);
    if (isActive) {
      callObject.on(eventName, listener);
    }
  };
  return {
    addListener,
    addListeners: (listeners: ListenerMap | ListenerTuple) => {
      if (Array.isArray(listeners)) {
        let [eventNames, listener] = listeners;
        for (let eventName of eventNames) {
          addListener(eventName, listener);
        }
      } else {
        for (let [eventName, listener] of Object.entries(listeners)) {
          // This if check should not be necessary, but tsc complains
          if (listener) {
            addListener(eventName as DailyEvent, listener);
          }
        }
      }
    },
    disableListeners: () => {
      if (isActive) {
        for (let [eventName, listeners] of Object.entries(listenerStore)) {
          if (listeners) {
            for (let listener of listeners) {
              callObject.off(eventName as DailyEvent, listener);
            }
          }
        }
        isActive = false;
      }
    },
    enableListeners: () => {
      if (!isActive) {
        for (let [eventName, listeners] of Object.entries(listenerStore)) {
          if (listeners) {
            for (let listener of listeners) {
              callObject.on(eventName as DailyEvent, listener);
            }
          }
        }
        isActive = true;
      }
    },
  };
}

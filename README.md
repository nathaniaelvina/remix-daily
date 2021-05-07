## How to Run

- `yarn`
- `pod install`
- Configure the signing on xcode
- Change the key and organization name on `constants.ts`
- `yarn start`
- On the first run you may wanna create the meeting first, just uncomment `createMeeting` on `CallOneScene`

## How to reproduce

- There will be 3 screens, join the first call
- Wait until it's succesfully joined. You might want to check the terminal to know if it's already succesfully join since we dont provide one.
- Listen if both devices can hear each other
- Go to second call
- Wait until it's successfully joined.
- Listen if both devices can hear each other
- Go back to first call and listen again
- Go back to home
- In this repo, we add `wait(3000)`. See `RtcCallProvider.tsx` on `addCallToStack` function. Try to uncomment the `setTimeOut` and repeat from step 1.

## Note:

- in the real app, we set `subscribeToTracksAutomatically` to `false` and subscribing manually by listening to the event listener. but for simplicity, we'll auto subscribe

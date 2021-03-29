import {DAILY_KEY, WEBHOOK_HOST} from '../constants';

export async function createMeeting(meetingId: string) {
  let url = 'https://api.daily.co/v1/rooms';
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        sfu_switchover: 1,
        signaling_impl: 'ws',
        meeting_join_hook: WEBHOOK_HOST ? `${WEBHOOK_HOST}/join` : undefined,
      },
      name: meetingId,
      privacy: 'private',
    }),
  };
  try {
    let response = await fetch(url, options);
    let result = await response.json();
    console.log('RESULT', result, response.status);
    if (
      response.status === 400 &&
      String(result?.info).match(/already exists$/)
    ) {
      console.warn(`Meeting ${meetingId} already exists.`);
    } else {
      return true;
    }
  } catch (error) {
    console.warn('Error creating meeting:', error);
  }
  return false;
}

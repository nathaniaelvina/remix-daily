import {DAILY_KEY} from '../constants';

export async function getJoinToken(id: string, meetingId: string) {
  let url = 'https://api.daily.co/v1/meeting-tokens';
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        room_name: meetingId,
        start_audio_off: false,
        user_id: id,
        user_name: '',
      },
    }),
  };

  let response = await fetch(url, options);
  let result = await response.json();
  return String(result?.token);
}

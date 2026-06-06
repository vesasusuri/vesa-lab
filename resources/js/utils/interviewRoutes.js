
export const USER_INTERVIEWS_PATH = '/user-dashboard/interviews';

export function userInterviewJoinPath(accessToken) {
  return `${USER_INTERVIEWS_PATH}/join/${encodeURIComponent(accessToken)}`;
}

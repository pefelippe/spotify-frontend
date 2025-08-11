// Spotify Web API does not provide endpoints to list followers for a given user.
// This file intentionally throws to make the limitation explicit if used.

export const fetchUserFollowers = async (_accessToken: string, _userId: string) => {
  throw new Error('Spotify API does not expose a followers list for users');
};


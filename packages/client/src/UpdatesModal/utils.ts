import { restore, save } from '../utils/storage';

const KEYS = {
  LAST_SEEN_UPDATE: 'last_seen_update',
};

const LATEST_UPDATE = '06-01-2024';

export const checkHasUserViewedLatestUpdate = () => {
  const lastSeenUpdate = restore<string>(KEYS.LAST_SEEN_UPDATE);
  return lastSeenUpdate === LATEST_UPDATE;
};

export const saveLastSeenUpdate = () => {
  save(KEYS.LAST_SEEN_UPDATE, LATEST_UPDATE);
};

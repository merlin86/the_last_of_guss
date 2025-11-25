import { AxiosError } from 'axios';
import { fetchRounds, type RoundResponse } from '../../external/backend';
import { useSyncExternalStore } from 'react';

const FETCH_PERIOD_MS = 10000;

export interface RoundsData {
  is_error: boolean;
  is_token_expired: boolean;
  rounds: RoundResponse[];
}

let token: string | null = null;
let data: RoundsData = { is_error: false, is_token_expired: false, rounds: [] };
let listeners: (() => void)[] = [];
let timer: number | null = null;

export const roundsStore = {
  setToken(new_token: string | null) {
    if (token !== new_token) {
      token = new_token;
      void fetchData();
    }
  },

  resetErrors() {
    data = { is_error: false, is_token_expired: false, rounds: data.rounds };
    emitChange();
  },

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  subscribe(this: void, listener: () => void) {
    listeners = [...listeners, listener];
    void fetchData();
    startFetching();
    return () => {
      listeners = listeners.filter(l => l !== listener);
      if (listeners.length === 0) {
        stopFetching();
      }
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  getSnapshot(this: void) {
    return data;
  }
};

export function useRoundsStore() {
  const store = useSyncExternalStore(roundsStore.subscribe, roundsStore.getSnapshot);
  return store;
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function startFetching() {
  if (timer !== null) {
    return;
  }

  timer = setInterval(() => {
    void fetchData();
  }, FETCH_PERIOD_MS);
}

function stopFetching() {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

async function fetchData() {
  if (!token) {
    return;
  }

  const new_data: RoundsData = { is_error: false, is_token_expired: false, rounds: data.rounds };

  try {
    const response = await fetchRounds(token);
    new_data.rounds = response.data ?? [];
  } catch (error: unknown) {
    new_data.is_error = true;
    if (error instanceof AxiosError && error.response?.status === 401) {
      new_data.is_token_expired = true;
    } else {
      console.error(error);
    }
  }

  data = new_data;
  emitChange();
}

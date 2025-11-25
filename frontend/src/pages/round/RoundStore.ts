import { AxiosError } from 'axios';
import { fetchRound, sendTap, type RoundExtendedResponse } from '../../external/backend';
import { useSyncExternalStore } from 'react';

export interface RoundData {
  is_error: boolean;
  is_tap_send_error: boolean;
  is_token_expired: boolean;
  round: RoundExtendedResponse | null;
  my_score: number;
}

let token: string | null = null;
let round_id: string | null = null;
let data: RoundData = { is_error: false, is_tap_send_error: false, is_token_expired: false, round: null, my_score: 0 };
let listeners: (() => void)[] = [];

export const roundStore = {
  setTokenAndId(new_token: string | null, new_round_id: string | null) {
    if (token !== new_token || round_id !== new_round_id) {
      token = new_token;
      round_id = new_round_id;
      void fetchData();
    }
  },

  sendTap() {
    void commitTap();
  },

  updateData() {
    void fetchData();
  },

  resetData() {
    data = {
      is_error: false,
      is_tap_send_error: false,
      is_token_expired: false,
      round: null,
      my_score: 0,
    };
    emitChange();
  },

  resetErrors() {
    data = {
      is_error: false,
      is_tap_send_error: false,
      is_token_expired: false,
      round: data.round,
      my_score: data.my_score,
    };
    emitChange();
  },

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  subscribe(this: void, listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  getSnapshot(this: void) {
    return data;
  }
};

export function useRoundStore() {
  const store = useSyncExternalStore(roundStore.subscribe, roundStore.getSnapshot);
  return store;
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

async function fetchData() {
  if (!token || !round_id) {
    return;
  }

  const new_data: RoundData = {
    is_error: false,
    is_tap_send_error: data.is_tap_send_error,
    is_token_expired: false,
    round: data.round,
    my_score: data.my_score,
  };

  try {
    const response = await fetchRound(token, round_id);
    new_data.round = response.data ?? null;
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

async function commitTap() {
  if (!token || !round_id) {
    return;
  }

  const new_data: RoundData = {
    is_error: data.is_error,
    is_tap_send_error: false,
    is_token_expired: false,
    round: data.round,
    my_score: data.my_score,
  };

  try {
    const response = await sendTap(token, round_id);
    const new_score = response.data?.score ?? 0;
    if (new_score > new_data.my_score) {
      new_data.my_score = new_score;
    }
  } catch (error: unknown) {
    new_data.is_tap_send_error = true;
    if (error instanceof AxiosError && error.response?.status === 401) {
      new_data.is_token_expired = true;
    } else {
      console.error(error);
    }
  }

  data = new_data;
  emitChange();
}

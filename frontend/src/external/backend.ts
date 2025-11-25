import axios from 'axios';

export interface BackendError {
  code: string;
  message: string;
}

export interface BackendResponse<T> {
  status: 'OK' | 'ERROR';
  data?: T;
  error: BackendError | null;
}

export interface LoginResponse {
  token: string;
}

export interface RoundResponse {
  round_id: string;
  round_start: string;
  round_end: string;
  status: 'active' | 'completed' | 'cooldown';
}

export interface RoundExtendedResponse extends RoundResponse {
  total_score?: number;
  winner_name?: string;
  winner_score?: number;
  my_score?: number;
}

export interface TapResponse {
  score: number;
}

export async function login(login: string, password: string): Promise<BackendResponse<LoginResponse>> {
  const response = await axios.post<BackendResponse<LoginResponse>>('/v1/api/login', {
    login,
    password,
  }, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

export async function fetchRounds(token: string): Promise<BackendResponse<RoundResponse[]>> {
  const response = await axios.get<BackendResponse<RoundResponse[]>>('/v1/api/rounds', {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function fetchRound(token: string, round_id: string): Promise<BackendResponse<RoundExtendedResponse>> {
  const response = await axios.get<BackendResponse<RoundExtendedResponse>>(`/v1/api/rounds/${round_id}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createRound(token: string): Promise<BackendResponse<RoundResponse>> {
  const response = await axios.post<BackendResponse<RoundResponse>>('/v1/api/rounds', {}, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function sendTap(token: string, round_id: string): Promise<BackendResponse<TapResponse>> {
  const response = await axios.post<BackendResponse<TapResponse>>(`/v1/api/rounds/${round_id}/tap`, {}, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

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

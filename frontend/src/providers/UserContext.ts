import { createContext, use, type Dispatch } from 'react';

export interface UserData {
  token: string;
  name: string;
  role: string;
}

export interface UserDispatchAction {
  type: 'login' | 'logout';
  token?: string;
}

export const UserContext = createContext(null as UserData | null);
export const UserDispatchContext = createContext(null as Dispatch<UserDispatchAction> | null);

export function useUser() {
  return use(UserContext);
}

export function useUserDispatch() {
  const dispatch = use(UserDispatchContext);
  if (dispatch === null) {
    throw new Error('useUserDispatch must be used within a UserProvider');
  }
  return dispatch;
}

export function userReducer(_state: UserData | null, action: UserDispatchAction): UserData | null {
  switch (action.type) {
    case 'login': {
      if (!action.token) {
        throw new Error('Token is required for login action');
      }

      const decoded_token = JSON.parse(atob(action.token.split('.')[1])) as UserData;

      localStorage.setItem('token', action.token);
      return {
        token: action.token,
        name: decoded_token.name,
        role: decoded_token.role,
      };
    }

    case 'logout': {
      localStorage.removeItem('token');
      return null;
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type as string}`);
    }
  }
}

export function userInit(): UserData | null {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded_token = JSON.parse(atob(token.split('.')[1])) as UserData;
    return {
      token: token,
      name: decoded_token.name,
      role: decoded_token.role,
    };
  }
  return null;
}

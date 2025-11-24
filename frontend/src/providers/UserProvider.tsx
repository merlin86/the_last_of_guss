import { useReducer, type ReactNode } from 'react';
import { UserContext, UserDispatchContext, userInit, userReducer } from './UserContext';

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, dispatch] = useReducer(userReducer, null, userInit);

  return (
    <UserContext value={user}>
      <UserDispatchContext value={dispatch}>
        {children}
      </UserDispatchContext>
    </UserContext>
  );
}

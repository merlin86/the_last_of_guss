import LoginPage from './pages/login/LoginPage';
import UserProvider from './providers/UserProvider';

export default function App() {
  return (
    <UserProvider>
      <LoginPage />
    </UserProvider>
  );
}

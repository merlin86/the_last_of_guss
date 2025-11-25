import { BrowserRouter, Route, Routes } from 'react-router';
import LoginPage from './pages/login/LoginPage';
import RoundsListPage from './pages/rounds_list/RoundsListPage';
import UserProvider from './providers/UserProvider';
import RoundPage from './pages/round/RoundPage';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<RoundsListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/round/:round_id" element={<RoundPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

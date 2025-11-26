import { BrowserRouter, Route, Routes } from 'react-router';
import LoginPage from './pages/login/LoginPage';
import RoundsListPage from './pages/rounds_list/RoundsListPage';
import UserProvider from './providers/UserProvider';
import RoundPage from './pages/round/RoundPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<RoundsListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/round/:round_id" element={<RoundPage />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

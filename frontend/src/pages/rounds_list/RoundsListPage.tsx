import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import { useUser } from '../../providers/UserContext';
import { useEffect } from 'react';


export default function RoundsListPage() {
  const navigate = useNavigate();

  const user = useUser();

  useEffect(() => {
    if (!user) {
      void navigate('/login');
    }
  }, [navigate, user]);

  return (
    <Box>
      <Typography>{user?.name}</Typography>
      <Typography>{user?.role}</Typography>
   </Box>
  );
}

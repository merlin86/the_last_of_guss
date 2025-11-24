import Alert from '@mui/material/Alert';
import BoxWithTitle from '../../components/BoxWithTitle';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import { roundsStore, useRoundsStore } from './RoundsStore';
import RoundView from './RoundView';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router';
import { useUser, useUserDispatch } from '../../providers/UserContext';
import { useEffect } from 'react';

export default function RoundsListPage() {
  const navigate = useNavigate();

  const user = useUser();
  const userDispatch = useUserDispatch();

  const data = useRoundsStore();

  useEffect(() => {
    if (!user) {
      void navigate('/login');
    }
    roundsStore.setToken(user?.token ?? null);
  }, [navigate, user]);

  useEffect(() => {
    if (data.is_token_expired) {
      roundsStore.resetErrors();
      userDispatch({ type: 'logout' });
    }
  }, [data, navigate, userDispatch]);

  let content;
  if (data.rounds.length === 0) {
    content = (
      <>
        <Skeleton variant="rounded" height={240} sx={{ marginTop: 2 }} />
        <Skeleton variant="rounded" height={240} sx={{ marginTop: 2 }} />
        <Skeleton variant="rounded" height={240} sx={{ marginTop: 2 }} />
      </>
    );
  } else {
    content = data.rounds.map(round => (
      <RoundView key={round.round_id} round={round} />
    ));
  }

  return (
    <Container maxWidth="md">
      <BoxWithTitle title="Список раундов" secondary={user?.name} content_component="main">
        <Collapse in={data.is_error}>
          <Alert severity='error' variant='filled' sx={{ marginTop: 2 }}>
            Ошибка при загрузке списка раундов
          </Alert>
        </Collapse>
        {content}
      </BoxWithTitle>
    </Container>
  );
}

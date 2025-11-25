import Alert from '@mui/material/Alert';
import BoxWithTitle from '../../components/BoxWithTitle';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import { createRound } from '../../external/backend';
import { roundsStore, useRoundsStore } from './RoundsStore';
import RoundView from './RoundView';
import Skeleton from '@mui/material/Skeleton';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { useNavigate } from 'react-router';
import { useUser, useUserDispatch } from '../../providers/UserContext';
import { useEffect, useState } from 'react';

export default function RoundsListPage() {
  const navigate = useNavigate();

  const user = useUser();
  const userDispatch = useUserDispatch();

  const data = useRoundsStore();
  const [roundCreationError, setRoundCreationError] = useState(false);

  // if not logged in, redirect to login page
  useEffect(() => {
    if (!user) {
      void navigate('/login');
    }
    roundsStore.setToken(user?.token ?? null);
  }, [navigate, user]);

  // if token expired, log out user
  useEffect(() => {
    if (data.is_token_expired) {
      roundsStore.resetErrors();
      userDispatch({ type: 'logout' });
    }
  }, [data, navigate, userDispatch]);

  const onCreateRoundClick = () => {
    void createRound(user!.token).then(response => {
      if (response.status === 'OK' && response.data) {
        setRoundCreationError(false);
      } else if (response.status === 'ERROR' && response.error) {
        console.error(response.error);
        setRoundCreationError(true);
      }
    }).catch(() => {
      setRoundCreationError(true);
    });
  }

  let admin_content;
  if (user?.role === 'admin') {
    admin_content = (
      <>
        <Collapse in={roundCreationError}>
          <Alert severity='error' variant='filled' sx={{ marginBottom: 2 }}>
            Ошибка при создании раунда
          </Alert>
        </Collapse>
        <Button variant='contained' sx={{ marginBottom: 2 }} onClick={onCreateRoundClick}>
          Создать раунд
        </Button>
      </>
    );
  }

  let content;
  if (data.rounds.length === 0) {
    content = (
      <>
        <Skeleton variant='rounded' height={240} sx={{ marginTop: 2 }} />
        <Skeleton variant='rounded' height={240} sx={{ marginTop: 2 }} />
        <Skeleton variant='rounded' height={240} sx={{ marginTop: 2 }} />
      </>
    );
  } else {
    content = <TransitionGroup>
      {data.rounds.map(round => (
        <Collapse key={round.round_id} in={true}>
          <RoundView round={round} />
        </Collapse>
      ))}
    </TransitionGroup>;
  }

  return (
    <Container maxWidth='md'>
      <BoxWithTitle title='Список раундов' secondary={user?.name} content_component='main'>
        <Collapse in={data.is_error}>
          <Alert severity='error' variant='filled' sx={{ marginBottom: 2 }}>
            Ошибка при загрузке списка раундов
          </Alert>
        </Collapse>
        {admin_content}
        {content}
      </BoxWithTitle>
    </Container>
  );
}

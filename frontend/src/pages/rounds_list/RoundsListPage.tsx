import Alert from '@mui/material/Alert';
import BoxWithTitle from '../../components/BoxWithTitle';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import {
  createRound,
  fetchRounds,
  isTokenExpired,
  type RoundResponse,
} from '../../external/backend';
import { Link, useNavigate } from 'react-router';
import RoundView from './RoundView';
import Skeleton from '@mui/material/Skeleton';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useUser, useUserDispatch } from '../../providers/UserContext';

function getView(data?: RoundResponse[]) {
  if (!data) {
    return (
      <>
        <Skeleton variant='rounded' height={240} sx={{ marginTop: 2 }} />
        <Skeleton variant='rounded' height={240} sx={{ marginTop: 2 }} />
        <Skeleton variant='rounded' height={240} sx={{ marginTop: 2 }} />
      </>
    );
  }

  return (
     <TransitionGroup>
      {data.map(round => (
        <Collapse key={round.round_id} in={true}>
          <Link to={`/round/${round.round_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <RoundView round={round} />
          </Link>
        </Collapse>
      ))}
    </TransitionGroup>
  );
}

export default function RoundsListPage() {
  const navigate = useNavigate();

  const user = useUser();
  const userDispatch = useUserDispatch();

  const data = useQuery({
    queryKey: ['rounds_list'],
    queryFn: async () => {
      if (user?.token) {
        const response = await fetchRounds(user.token);
        if (response.status === 'OK' && response.data) {
          return response.data;
        } else {
          throw new Error(response.error?.message || 'Unknown error');
        }
      }
      return;
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const createNewRound = useMutation({
    mutationFn: async (token: string) => {
      const response = await createRound(token);
      if (response.status === 'OK' && response.data) {
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Unknown error');
      }
    },
    onSuccess: (data) => {
      void navigate(`/round/${data.round_id}`);
    },
  });

  // if not logged in, redirect to login page
  useEffect(() => {
    if (!user) {
      void navigate('/login');
    }
  }, [navigate, user]);

  // if token expired, log out user
  useEffect(() => {
    if (data.isError && isTokenExpired(data.error)) {
      userDispatch({ type: 'logout' });
    }
  }, [data, navigate, userDispatch]);

  const onCreateRoundClick = () => {
   if (user?.token) {
    createNewRound.mutate(user.token);
   }
  }

  return (
    <Container maxWidth='md'>
      <BoxWithTitle title='Список раундов' secondary={user?.name} content_component='main'>
        <Collapse in={data.isError}>
          <Alert severity='error' variant='filled' sx={{ marginBottom: 2 }}>
            Ошибка при загрузке списка раундов
          </Alert>
        </Collapse>
        {user?.role === 'admin' && (<>
          <Collapse in={createNewRound.isError}>
            <Alert severity='error' variant='filled' sx={{ marginBottom: 2 }}>
              Ошибка при создании раунда
            </Alert>
          </Collapse>
          <Button
            variant='contained'
            sx={{ marginBottom: 2 }}
            onClick={onCreateRoundClick}
            disabled={createNewRound.isPending}
          >
            Создать раунд
          </Button>
        </>)}
        {getView(data.data)}
      </BoxWithTitle>
    </Container>
  );
}

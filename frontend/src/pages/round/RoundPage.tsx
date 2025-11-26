/* eslint-disable @typescript-eslint/no-unused-vars */
import ActiveRoundInfo from './ActiveRoundInfo';
import Alert from '@mui/material/Alert';
import BoxWithTitle from '../../components/BoxWithTitle';
import Collapse from '@mui/material/Collapse';
import CooldownRoundInfo from './CooldownRoundInfo';
import Container from '@mui/material/Container';
import { DateTime } from 'luxon';
import { fetchRound, isTokenExpired, sendTap, type RoundExtendedResponse } from '../../external/backend';
import FinishedRoundInfo from './FinishedRoundInfo';
import Goose from './Goose';
import Skeleton from '@mui/material/Skeleton';
import { useEffect, useState, type JSX } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { useUser, useUserDispatch } from '../../providers/UserContext';

function computeStatus(round_start: string, round_end: string): 'active' | 'cooldown' | 'completed' {
  const now = DateTime.utc();
  const start_time = DateTime.fromISO(round_start, { zone: 'utc' });
  const end_time = DateTime.fromISO(round_end, { zone: 'utc' });

  if (now < start_time) {
    return 'cooldown';
  } else if (now >= start_time && now <= end_time) {
    return 'active';
  } else {
    return 'completed';
  }
}

function getRoundView(
  data?: RoundExtendedResponse,
  status?: 'active' | 'cooldown' | 'completed' | null,
  score?: number,
): { page_title: string, info_content: JSX.Element } {
  if (!status || !data) {
    return {
      page_title: 'Раунды',
      info_content: <Skeleton variant='rounded' height={150} />
    };
  }

  switch (status) {
    case 'cooldown':
      return {
        page_title: 'Cooldown',
        info_content: <CooldownRoundInfo round={data} />
      };

    case 'active':
      return {
        page_title: 'Раунды',
        info_content: <ActiveRoundInfo round={data} score={score ?? 0} />
      };

    case 'completed':
      return {
        page_title: 'Раунд завершен',
        info_content: <FinishedRoundInfo round={data} />
      };
  }
}

export default function RoundPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams<{ round_id: string }>();

  const user = useUser();
  const userDispatch = useUserDispatch();

  const [status, setStatus] = useState<'active' | 'cooldown' | 'completed' | null>(null);
  const [score, setScore] = useState(0);

  const data = useQuery({
    queryKey: ['round', params.round_id],
    queryFn: async () => {
      if (user?.token && params.round_id) {
        const response = await fetchRound(user.token, params.round_id);
        if (response.status === 'OK' && response.data) {
          // updating the status state
          setStatus(computeStatus(response.data.round_start, response.data.round_end));
          return response.data;
        } else {
          throw new Error(response.error?.message || 'Unknown error');
        }
      }
    },
  });

  const doTap = useMutation({
    mutationFn: async (data: { token: string, round_id: string }) => {
      const response = await sendTap(data.token, data.round_id);
      if (response.status === 'OK' && response.data) {
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Unknown error');
      }
    },
    onSuccess: (data) => {
      // responses can arrive in any order, so need to double check
      if (data.score > score) {
        setScore(data.score);
      }
    }
  });

  // if not logged in, redirect to login page
  useEffect(() => {
    if (!user) {
      void navigate('/login');
    }
  }, [navigate, user]);

  // if token expired, log out user
  useEffect(() => {
    if ((data.isError && isTokenExpired(data.error)) || (doTap.isError && isTokenExpired(doTap.error))) {
      userDispatch({ type: 'logout' });
    }
  }, [data, doTap, userDispatch]);

  // dynamically update round status
  useEffect(() => {
    if (data !== null && status !== 'completed') {
      const interval = setInterval(() => {
        if (!data.data) {
          return;
        }

        const new_status = computeStatus(data.data.round_start, data.data.round_end);
        if (new_status !== status) {
          if (new_status === 'completed') {
            queryClient.invalidateQueries({ queryKey: ['round', params.round_id] });
          }
          setStatus(new_status);
        }
      }, 500);
      return () => { clearInterval(interval); };
    }
  }, [data, status]);

  const onGooseClick = () => {
    if (user?.token && params.round_id && status === 'active') {
      doTap.mutate({ token: user.token, round_id: params.round_id });
    }
  }

  const { page_title, info_content } = getRoundView(data.data, status, score);

  return (
    <Container maxWidth="sm">
      <BoxWithTitle title={page_title} secondary={user?.name} content_component='main'>
        <Collapse in ={data.isError}>
          <Alert severity='error' variant='filled' sx={{ marginBottom: 2 }}>
            Ошибка при получении данных раунда
          </Alert>
        </Collapse>
        <Collapse in ={doTap.isError}>
          <Alert severity='error' variant='filled' sx={{ marginBottom: 2 }}>
            Ошибка при отправке тапа
          </Alert>
        </Collapse>
        <Goose clickable={status === 'active'} onClick={onGooseClick} />
        {info_content}
      </BoxWithTitle>
    </Container>
  );
}

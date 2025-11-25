/* eslint-disable @typescript-eslint/no-unused-vars */
import ActiveRoundInfo from './ActiveRoundInfo';
import Alert from '@mui/material/Alert';
import BoxWithTitle from '../../components/BoxWithTitle';
import Collapse from '@mui/material/Collapse';
import CooldownRoundInfo from './CooldownRoundInfo';
import Container from '@mui/material/Container';
import { DateTime } from 'luxon';
import FinishedRoundInfo from './FinishedRoundInfo';
import Goose from './Goose';
import { roundStore, useRoundStore } from './RoundStore';
import Skeleton from '@mui/material/Skeleton';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useUser, useUserDispatch } from '../../providers/UserContext';
import { roundsStore } from '../rounds_list/RoundsStore';

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

export default function RoundPage() {
  const navigate = useNavigate();
  const params = useParams<{ round_id: string }>();

  const user = useUser();
  const userDispatch = useUserDispatch();

  const data = useRoundStore();
  const [status, setStatus] = useState<'active' | 'cooldown' | 'completed' | null>(data.round?.status ?? null);

  // if not logged in, redirect to login page
  useEffect(() => {
    if (!user) {
      void navigate('/login');
    }
    roundStore.setTokenAndId(user?.token ?? null, params.round_id ?? null);
  }, [navigate, user, params.round_id]);

  // if token expired, log out user
  useEffect(() => {
    if (data.is_token_expired) {
      roundsStore.resetErrors();
      userDispatch({ type: 'logout' });
    }
  }, [data, navigate, userDispatch]);

  // dynamically update round status
  useEffect(() => {
    if (data.round !== null && status !== 'completed') {
      const interval = setInterval(() => {
        const new_status = computeStatus(data.round!.round_start, data.round!.round_end);
        if (new_status !== status) {
          if (new_status === 'completed') {
            roundStore.updateData();
          }
          setStatus(new_status);
        }
      });
      return () => { clearInterval(interval); };
    }
  }, [data.round, status]);

  // cleanup store on unmount
  useEffect(() => {
    return () => {
      roundStore.setTokenAndId(null, null);
      roundStore.resetData();
    };
  }, []);

  const onGooseClick = () => {
    roundStore.sendTap();
  }

  let page_title = 'Раунды';
  let info_content = <Skeleton variant='rounded' height={150} />;
  switch (status) {
    case 'cooldown':
      page_title = 'Cooldown';
      info_content = <CooldownRoundInfo round={data.round!} />
      break;

    case 'active':
      info_content = <ActiveRoundInfo round={data.round!} score={data.my_score} />;
      break;

    case 'completed':
      page_title = 'Раунд завершен';
      info_content = <FinishedRoundInfo round={data.round!} />
  }

  return (
    <Container maxWidth="sm">
      <BoxWithTitle title={page_title} secondary={user?.name} content_component='main'>
        <Collapse in ={data.is_error}>
          <Alert severity='error' variant='filled' sx={{ marginBottom: 2 }}>
            Ошибка при получении данных раунда
          </Alert>
        </Collapse>
        <Collapse in ={data.is_tap_send_error}>
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

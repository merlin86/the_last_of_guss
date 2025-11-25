/* eslint-disable @typescript-eslint/no-unused-vars */
import ActiveRoundInfo from './ActiveRoundInfo';
import BoxWithTitle from '../../components/BoxWithTitle';
import CooldownRoundInfo from './CooldownRoundInfo';
import Container from '@mui/material/Container';
import FinishedRoundInfo from './FinishedRoundInfo';
import Goose from './Goose';
import Skeleton from '@mui/material/Skeleton';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useUser, useUserDispatch } from '../../providers/UserContext';
import type { RoundExtendedResponse } from '../../external/backend';

const round: RoundExtendedResponse = {
  round_id: 'round123',
  round_start: '2025-11-25T13:10:00Z',
  round_end: '2025-11-25T13:30:00Z',
  status: 'completed',
  total_score: 150,
  winner_name: 'PlayerOne',
  winner_score: 60,
  my_score: 45,
};

export default function RoundPage() {
  const navigate = useNavigate();
  const params = useParams<{ round_id: string }>();

  const user = useUser();
  const userDispatch = useUserDispatch();

  // if not logged in, redirect to login page
  useEffect(() => {
    if (!user) {
      void navigate('/login');
    }
  }, [navigate, user]);

  const onGooseClick = () => {
    console.log('Goose clicked!');
  }

  return (
    <Container maxWidth="sm">
      <BoxWithTitle title='Раунды' secondary={user?.name} content_component='main'>
        <Goose onClick={onGooseClick} />
        <FinishedRoundInfo round={round} />
        {/* <Skeleton variant='rounded' height={150} /> */}
      </BoxWithTitle>
    </Container>
  );
}
